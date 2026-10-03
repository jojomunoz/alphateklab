#!/usr/bin/env python3
"""Pone las pantallas reales de las demos (y el QR real de la mesa 7) encima de las fotos generadas del equipo.

Las fotos de GPT traen las pantallas apagadas o en gris y la placa con un cuadrado blanco; GPT no dibuja ni un QR ni
una interfaz. Aquí se busca cada pantalla en la foto, se deforma la captura en perspectiva para que calce en sus
cuatro esquinas y se mezcla con la luz de la foto:
  - «pantalla»: emite luz; se conserva un reflejo suave en diagonal para que no se vea pegada.
  - «papel»: la placa impresa; se multiplica por la sombra del papel de la foto.
  - «luz»: solo suma luz (los números del teclado de la cerradura sobre su vidrio negro).

Uso (después de herramientas/pantallas-equipo.mjs):
  python3 herramientas/componer-equipo.py <carpeta de originales> <carpeta de pantallas> <carpeta de salida>
Originales: ~/alphateklab/originales (fuera del repositorio). Requiere Pillow y numpy.
"""
import math
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter


# ── dónde está cada pantalla ─────────────────────────────────────────────

def _vecinos(m, operacion):
    d = m.copy()
    for desde, hacia in (((slice(1, None), slice(None)), (slice(None, -1), slice(None))),
                         ((slice(None, -1), slice(None)), (slice(1, None), slice(None))),
                         ((slice(None), slice(1, None)), (slice(None), slice(None, -1))),
                         ((slice(None), slice(None, -1)), (slice(None), slice(1, None)))):
        d[desde] = operacion(d[desde], m[hacia])
    return d


def region_clara(arr, semilla, lo, hi, sat_max, paso=2, apertura=0):
    """Región conexa de luz pareja que contiene la semilla (pantallas grises y el papel blanco).

    «apertura» borra antes los puentes finos (el canto brillante de un acrílico que toca la pantalla de atrás):
    se encoge la máscara esas veces, se busca la región y se la vuelve a agrandar dentro de la máscara original.
    """
    a = arr[::paso, ::paso].astype(int)
    lum = a.mean(axis=2)
    sat = a.max(axis=2) - a.min(axis=2)
    original = (lum >= lo) & (lum <= hi) & (sat <= sat_max)
    mask = original
    for _ in range(apertura):
        mask = _vecinos(mask, np.logical_and)
    sy, sx = semilla[1] // paso, semilla[0] // paso
    if not mask[sy, sx]:
        raise ValueError(f'la semilla {semilla} no cae en la pantalla (luz {lum[sy, sx]:.0f}, color {sat[sy, sx]})')
    reg = np.zeros_like(mask)
    reg[sy, sx] = True
    while True:
        d = reg.copy()
        d[1:, :] |= reg[:-1, :]
        d[:-1, :] |= reg[1:, :]
        d[:, 1:] |= reg[:, :-1]
        d[:, :-1] |= reg[:, 1:]
        d &= mask
        if (d == reg).all():
            break
        reg = d
    for _ in range(apertura):
        reg = _vecinos(reg, np.logical_or) & original
    ys, xs = np.nonzero(reg)
    return np.stack([xs * paso, ys * paso], axis=1).astype(float)


def borde_por_rayos(ruta, centro, umbral=0.72, max_r=1600):
    """Borde de una pantalla oscura con degradado: rayos que se detienen donde la luz cae al bisel."""
    L = np.asarray(Image.open(ruta).convert('L').filter(ImageFilter.GaussianBlur(2))).astype(float)
    h, w = L.shape
    cx, cy = centro
    puntos = []
    for g in np.arange(0, 360, 0.5):
        t = math.radians(g)
        dx, dy = math.cos(t), math.sin(t)
        vistos, bajo = [], 0
        for r in range(5, max_r):
            x, y = int(round(cx + dx * r)), int(round(cy + dy * r))
            if not (0 <= x < w and 0 <= y < h):
                break
            v = L[y, x]
            if len(vistos) > 20 and v < umbral * float(np.median(vistos[-40:])):
                bajo += 1
                if bajo >= 4:
                    puntos.append((cx + dx * (r - 3), cy + dy * (r - 3)))
                    break
                continue
            bajo = 0
            vistos.append(v)
    return np.array(puntos)


def cuadrilatero(P, centro=None, margen_esq=7):
    """Cuatro esquinas de un borde: rectas por lado (sin las esquinas redondeadas) e intersecciones."""
    xs, ys = P[:, 0], P[:, 1]
    cx, cy = centro if centro else (xs.mean(), ys.mean())
    s, d = xs + ys, xs - ys
    aprox = [P[s.argmin()], P[d.argmax()], P[s.argmax()], P[d.argmin()]]  # arriba-izq, arriba-der, abajo-der, abajo-izq
    ang_p = (np.degrees(np.arctan2(ys - cy, xs - cx)) + 360) % 360
    ang = [math.degrees(math.atan2(p[1] - cy, p[0] - cx)) % 360 for p in aprox]
    lados = []
    for i in range(4):
        a0, a1 = ang[i], ang[(i + 1) % 4]
        if a0 <= a1:
            sel = (ang_p > a0 + margen_esq) & (ang_p < a1 - margen_esq)
        else:
            sel = (ang_p > a0 + margen_esq) | (ang_p < a1 - margen_esq)
        Q = P[sel]
        if len(Q) < 8:
            raise ValueError('muy pocos puntos en un lado')
        for _ in range(2):
            m = Q.mean(axis=0)
            _, _, vt = np.linalg.svd(Q - m)
            dist = np.abs((Q - m) @ vt[1])
            Q = Q[dist <= np.quantile(dist, 0.85)]
        m = Q.mean(axis=0)
        _, _, vt = np.linalg.svd(Q - m)
        lados.append((m, vt[0]))

    def corte(l1, l2):
        (p, u), (q, v) = l1, l2
        t = np.linalg.solve(np.array([u, -v]).T, q - p)
        return p + u * t[0]

    return [corte(lados[3], lados[0]), corte(lados[0], lados[1]), corte(lados[1], lados[2]), corte(lados[2], lados[3])]


def borde_de_region(puntos):
    """De una región llena, solo los puntos del contorno (para ajustar las rectas)."""
    P = puntos.astype(int)
    paso = int(np.gcd.reduce(np.diff(np.unique(P[:, 0])))) if len(np.unique(P[:, 0])) > 1 else 1
    conjunto = {(x, y) for x, y in P}
    borde = [(x, y) for x, y in P if any((x + dx, y + dy) not in conjunto for dx, dy in ((paso, 0), (-paso, 0), (0, paso), (0, -paso)))]
    return np.array(borde, dtype=float)


# ── perspectiva y mezcla ──────────────────────────────────────────────────

def coeficientes(destino, origen):
    """Coeficientes de PIL (salida → entrada) para que el rectángulo «origen» caiga en el cuadrilátero «destino»."""
    A, b = [], []
    for (x, y), (u, v) in zip(destino, origen):
        A.append([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.append(u)
        A.append([0, 0, 0, x, y, 1, -v * x, -v * y]); b.append(v)
    return np.linalg.solve(np.array(A, float), np.array(b, float)).tolist()


def mascara(tam, quad, escala=4, encoger=0.0):
    """Máscara del cuadrilátero con borde suave (dibujada en grande y reducida)."""
    w, h = tam
    c = np.array(quad, float).mean(axis=0)
    q = [tuple((np.array(p) - c) * (1 - encoger) + c) for p in quad]
    m = Image.new('L', (w * escala, h * escala), 0)
    ImageDraw.Draw(m).polygon([(x * escala, y * escala) for x, y in q], fill=255)
    return np.asarray(m.resize((w, h), Image.LANCZOS)).astype(float) / 255


def visible_de(puntos, tam, paso=2):
    """Dónde se ve de verdad la pantalla (los puntos de su región), un poco agrandado y con el borde suave: lo que
    tapa otro objeto (el teléfono delante de la tableta) queda fuera aunque caiga dentro del cuadrilátero."""
    w, h = tam
    m = Image.new('L', (w // paso + 1, h // paso + 1), 0)
    px = m.load()
    for x, y in puntos.astype(int):
        px[x // paso, y // paso] = 255
    m = m.resize((m.width * paso, m.height * paso), Image.NEAREST).crop((0, 0, w, h))
    m = m.filter(ImageFilter.MaxFilter(7)).filter(ImageFilter.GaussianBlur(1.2))
    return np.asarray(m).astype(float) / 255


def componer(base, contenido, quad, modo, recorte=0.0, brillo=1.0, visible=None):
    w, h = base.size
    cw, ch = contenido.size
    if recorte:
        dx, dy = int(cw * recorte), int(ch * recorte)
        contenido = contenido.crop((dx, dy, cw - dx, ch - dy))
        cw, ch = contenido.size
    coef = coeficientes(quad, [(0, 0), (cw, 0), (cw, ch), (0, ch)])
    plano = np.asarray(contenido.convert('RGB').transform((w, h), Image.PERSPECTIVE, coef, Image.BICUBIC)).astype(float)
    B = np.asarray(base.convert('RGB')).astype(float)
    M = mascara((w, h), quad)
    if visible is not None:
        M = M * visible
    M = M[..., None]
    if modo == 'papel':
        # la sombra del papel de la foto (normalizada a su parte más clara) oscurece la impresión como en la foto
        lum = B.mean(axis=2, keepdims=True)
        dentro = lum[M[..., 0] > 0.9]
        sombra = np.clip(lum / max(np.percentile(dentro, 95), 1), 0.6, 1.0)
        R = plano * sombra
    elif modo == 'luz':
        R = 255 - (255 - B) * (255 - plano * brillo) / 255  # «trama»: solo suma luz
    else:
        # pantalla encendida: un poco menos que blanco puro y un reflejo de vidrio en diagonal (6 %)
        yy, xx = np.mgrid[0:h, 0:w]
        q = np.array(quad, float)
        x0, x1 = q[:, 0].min(), q[:, 0].max()
        y0, y1 = q[:, 1].min(), q[:, 1].max()
        t = ((xx - x0) / max(x1 - x0, 1) + (yy - y0) / max(y1 - y0, 1)) / 2
        reflejo = (np.clip(1 - np.abs(t - 0.3) / 0.22, 0, 1) * 0.06)[..., None]
        R = plano * 0.94 * brillo
        R = R + (255 - R) * reflejo
    out = B * (1 - M) + R * M
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))


def ver(base, quads, ruta):
    im = base.copy()
    d = ImageDraw.Draw(im)
    for q in quads:
        d.line([tuple(p) for p in q] + [tuple(q[0])], fill=(255, 0, 255), width=4)
    im.save(ruta)


# ── qué va en cada foto ───────────────────────────────────────────────────

def trabajos(orig, pant):
    v3, v6 = orig / 'equipo-v3', orig / 'v6'
    return [
        dict(salida='equipo-1-placa-mesa', base=v3 / 'equipo-1-placa-mesa.png', capas=[
            dict(contenido=pant / 'placa.png', modo='papel', recorte=0.012, region=dict(semilla=(1000, 900), lo=215, hi=256, sat=18))]),
        dict(salida='equipo-2-tableta-cocina', base=v3 / 'equipo-2-tableta-cocina.png', capas=[
            dict(contenido=pant / 'cocina.png', modo='pantalla', rayos=dict(centro=(820, 940)))]),
        dict(salida='equipo-3-kiosco', base=v3 / 'equipo-3-kiosco.png', capas=[
            dict(contenido=pant / 'kiosco.png', modo='pantalla', rayos=dict(centro=(960, 440)))]),
        # el panel de la cerradura tiene un reflejo fuerte: el teclado va adentro, con margen, en vez de llenarlo
        dict(salida='equipo-6-cerradura', base=v3 / 'equipo-6-cerradura.png', capas=[
            dict(contenido=pant / 'teclado.png', modo='luz', brillo=0.92, quad=[(640, 420), (985, 440), (978, 1080), (640, 1060)])]),
        dict(salida='heroe-portada', base=v6 / 'heroe-portada.png', capas=[
            # la tableta va atrás: el canto del acrílico la toca, de ahí la apertura
            # varios negocios y no solo restaurantes: la agenda del consultorio, los avisos de distintos negocios y una
            # placa cuyo QR abre las demos
            dict(contenido=pant / 'recepcion.png', modo='pantalla', region=dict(semilla=(1083, 717), lo=150, hi=250, sat=22, apertura=4, tapada=True)),
            dict(contenido=pant / 'avisos-telefono.png', modo='pantalla', region=dict(semilla=(1322, 1200), lo=150, hi=250, sat=22)),
            dict(contenido=pant / 'placa-demos.png', modo='papel', region=dict(semilla=(696, 1214), lo=190, hi=256, sat=22))]),
        dict(salida='en-recepcion', base=v6 / 'en-recepcion.png', capas=[
            dict(contenido=pant / 'recepcion.png', modo='pantalla', region=dict(semilla=(1620, 720), lo=150, hi=250, sat=22))]),
        dict(salida='en-barberia', base=v6 / 'en-barberia.png', capas=[
            dict(contenido=pant / 'turnos.png', modo='pantalla', region=dict(semilla=(1760, 360), lo=150, hi=250, sat=32))]),
    ]


def main():
    orig, pant, salida = (Path(a).expanduser() for a in sys.argv[1:4])
    salida.mkdir(parents=True, exist_ok=True)
    solo = sys.argv[4:]  # nombres de salida, si se quiere rehacer solo algunas
    for t in trabajos(orig, pant):
        if solo and t['salida'] not in solo:
            continue
        base = Image.open(t['base']).convert('RGB')
        arr = np.asarray(base)
        quads = []
        for c in t['capas']:
            visible = None
            if 'quad' in c:
                quad = [tuple(map(float, p)) for p in c['quad']]
            elif 'rayos' in c:
                quad = cuadrilatero(borde_por_rayos(t['base'], c['rayos']['centro']), c['rayos']['centro'])
            else:
                r = c['region']
                P = region_clara(arr, r['semilla'], r['lo'], r['hi'], r['sat'], apertura=r.get('apertura', 0))
                quad = cuadrilatero(borde_de_region(P))
                if r.get('tapada'):
                    visible = visible_de(P, base.size)
            quad = [(float(x), float(y)) for x, y in quad]
            quads.append(quad)
            base = componer(base, Image.open(c['contenido']), quad, c['modo'], c.get('recorte', 0.0), c.get('brillo', 1.0), visible)
        base.save(salida / f"{t['salida']}.png")
        ver(Image.open(t['base']).convert('RGB'), quads, salida / f"{t['salida']}-contorno.png")
        print('ok', t['salida'], [[round(x), round(y)] for q in quads for (x, y) in q])


if __name__ == '__main__':
    main()

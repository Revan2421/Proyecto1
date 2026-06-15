import json, os, re

BASE = '/var/www/html'

def parse_js_json(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    content = re.sub(r'^\s*const\s+\w+\s*=\s*', '', content.strip())
    content = content.rstrip(';').strip()
    return json.loads(content)

def get_lang(environ):
    qs = environ.get('QUERY_STRING', '')
    for param in qs.split('&'):
        if param.startswith('lang='):
            return param.split('=')[1].upper()
    cookie = environ.get('HTTP_COOKIE', '')
    for c in cookie.split(';'):
        c = c.strip()
        if c.startswith('lang='):
            return c.split('=')[1].upper()
    return 'ES'

def application(environ, start_response):
    lang = get_lang(environ)

    config_path = os.path.join(BASE, 'conf', f'config{lang}.json')
    if not os.path.exists(config_path):
        lang = 'ES'
        config_path = os.path.join(BASE, 'conf', 'configES.json')

    config = parse_js_json(config_path)

    qs = environ.get('QUERY_STRING', '')
    ci = ''
    for param in qs.split('&'):
        if param.startswith('ci='):
            ci = param.split('=')[1]
            break

    if ci:
        profile_path = os.path.join(BASE, ci, 'profile.json')
        if not os.path.exists(profile_path):
            start_response('404 Not Found', [('Content-Type', 'text/html')])
            return [b'Perfil no encontrado']

        p = parse_js_json(profile_path)
        ext = p.get('image_ext', '.jpg')

        def fmt_list(items):
            return ', '.join(items) if isinstance(items, list) else items

        books = p.get('book', [])
        book_label = config['book'][1] if len(books) > 1 else config['book'][0]
        music = p.get('music', [])
        music_label = config['music'][1] if len(music) > 1 else config['music'][0]
        games = p.get('video_game', [])
        game_label = config['video_game'][1] if len(games) > 1 else config['video_game'][0]
        email = p.get('email', '')
        email_label = config['email'].replace('[email]', '')

        html_perfil = f'''
        <button onclick="showGrid()" style="margin:10px;">&#8592; {config['home']}</button>
        <section class="main-content">
            <div class="content-img">
                <img class="img-profile" src="/{ci}/{ci}Big{ext}" alt="{p['name']}" id="foto-perfil">
            </div>
            <div class="content-info">
                <h1 class="Nombre" id="Nombre_persona">{p['name']}</h1>
                <p class="cover-letter" id="descripcion_value">{p.get('description', '')}</p>
                <table class="bullets">
                    <tr>
                        <td id="Color_Fav">{config['color']}</td>
                        <td id="Color_Value">{p.get('color', '')}</td>
                    </tr>
                    <tr>
                        <td id="Libro_Fav">{book_label}</td>
                        <td id="Libro_Value">{fmt_list(books)}</td>
                    </tr>
                    <tr>
                        <td id="Genero_Musica">{music_label}</td>
                        <td id="Musica_Value">{fmt_list(music)}</td>
                    </tr>
                    <tr>
                        <td id="Game_Fav">{game_label}</td>
                        <td id="Game_value">{fmt_list(games)}</td>
                    </tr>
                    <tr style="font-weight: bold;">
                        <td id="Lenguaje_Fav">{config['language']}</td>
                        <td id="Lenguaje_Value">{fmt_list(p.get('language', []))}</td>
                    </tr>
                </table>
                <p class="bullets" style="margin-top: 15px;">
                    <span id="texto-correo">{email_label}</span><br>
                    <a class="link-correo" href="mailto:{email}" id="correo_value">{email}</a>
                </p>
            </div>
        </section>'''
        status = '200 OK'
        headers = [('Content-Type', 'text/html; charset=utf-8')]
        start_response(status, headers)
        return [html_perfil.encode('utf-8')]

    profiles = parse_js_json(os.path.join(BASE, 'data', 'index.json'))

    cards_html = ''
    for p in profiles:
        ci = p['ci']
        name = p['name']
        ext = p.get('image_ext', '.jpg')
        cards_html += f'''
        <a class="student-card" href="#" onclick="loadProfile('{ci}'); return false;">
            <img class="card-img" src="/{ci}/{ci}Small{ext}" alt="{name}">
            <div class="card-info">
                <p class="card-name">{name}</p>
            </div>
            <div class="card-bar"></div>
        </a>'''

    html = f'''<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ATI[UCV]Log 2026-1</title>
    <link rel="icon" sizes="192x192" href="/icon/cropped-logonuevo-192x192.png">
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    <header>
        <a class="logo" href="/ATI/index.py" id="titulo-ATI">{config['site'][0]}<span class="logo-sub">{config['site'][1]}</span>{config['site'][2]}</a>
        <nav class="nav-search">
            <input type="text" id="input-busqueda" placeholder="{config['name']}...">
            <button type="button" class="buscar-boton" id="btn-busqueda">{config['search']}</button>
        </nav>
        <div class="menu-user" id="icono-perfil">
            <span class="label-perfil" id="label-perfil">{config['profile']}</span>
            <div class="user-icon">&#128100;</div>
        </div>
        <div class="menu-icon" id="icono-menu">&#9776;</div>
    </header>
    <section>
        <h2 class="section-title">{config['semester']}</h2>
        <div id="student-grid" class="student-grid">
            {cards_html}
        </div>
        <div id="profile-view" style="display:none;"></div>
    </section>
    <footer>
        <p>{config['copyRight']}</p>
    </footer>
    <script>
        function loadProfile(ci) {{
            fetch('/ATI/index.py?ci=' + ci)
                .then(r => r.text())
                .then(html => {{
                    document.getElementById('student-grid').style.display = 'none';
                    document.getElementById('profile-view').innerHTML = html;
                    document.getElementById('profile-view').style.display = 'block';
                }});
        }}

        function showGrid() {{
            document.getElementById('student-grid').style.display = '';
            document.getElementById('profile-view').style.display = 'none';
            document.getElementById('profile-view').innerHTML = '';
        }}
    </script>
</body>
</html>'''

    status = '200 OK'
    headers = [
        ('Content-Type', 'text/html; charset=utf-8'),
        ('Set-Cookie', f'lang={lang}; Path=/')
    ]
    start_response(status, headers)
    return [html.encode('utf-8')]
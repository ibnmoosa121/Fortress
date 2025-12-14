import http.server
import socketserver
import json
import os
from urllib.parse import parse_qs
import urllib.request


class Handler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/api/contact':
            length = int(self.headers.get('Content-Length', 0))
            body_bytes = self.rfile.read(length)
            body = body_bytes.decode('utf-8') if body_bytes else ''
            ctype = self.headers.get('Content-Type', '')

            data = {}
            if 'application/x-www-form-urlencoded' in ctype:
                qs = parse_qs(body)
                data = {k: (v[0] if v else '') for k, v in qs.items()}
            elif 'application/json' in ctype:
                try:
                    data = json.loads(body)
                except Exception:
                    data = {}

            name = (data.get('name') or '').strip()
            email = (data.get('email') or '').strip()
            message = (data.get('message') or '').strip()

            ok = bool(name and email and message)
            if ok:
                try:
                    os.makedirs('data', exist_ok=True)
                    with open(os.path.join('data', 'contact_submissions.jsonl'), 'a', encoding='utf-8') as f:
                        f.write(json.dumps({'name': name, 'email': email, 'message': message}) + '\n')
                except Exception:
                    ok = False
            sent = False
            if ok:
                if os.environ.get('MAILERSEND_API_KEY'):
                    sent = mailersend_send(name, email, message)
                elif os.environ.get('SENDGRID_API_KEY'):
                    sent = sendgrid_send(name, email, message)

            resp = {'ok': ok, 'sent': sent}
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(resp).encode('utf-8'))
        else:
            self.send_error(404, 'Not Found')


if __name__ == '__main__':
    port = 8000
    with socketserver.ThreadingTCPServer(('', port), Handler) as httpd:
        print(f"Serving on http://localhost:{port}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass
        finally:
            httpd.server_close()

def sendgrid_send(name, email, message):
    key = os.environ.get('SENDGRID_API_KEY')
    to_email = os.environ.get('SENDGRID_TO')
    from_email = os.environ.get('SENDGRID_FROM') or to_email or 'no-reply@example.com'
    if not key or not to_email:
        return False
    payload = {
        "personalizations": [{"to": [{"email": to_email}]}],
        "from": {"email": from_email},
        "subject": f"New contact from {name}",
        "content": [{"type": "text/plain", "value": f"Name: {name}\nEmail: {email}\n\n{message}"}]
    }
    req = urllib.request.Request(
        'https://api.sendgrid.com/v3/mail/send',
        data=json.dumps(payload).encode('utf-8'),
        headers={'Authorization': f'Bearer {key}', 'Content-Type': 'application/json'}
    )
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status in (200, 202)
    except Exception:
        return False

def mailersend_send(name, email, message):
    key = os.environ.get('MAILERSEND_API_KEY')
    to_email = os.environ.get('MAILERSEND_TO')
    from_email = os.environ.get('MAILERSEND_FROM') or to_email or 'no-reply@example.com'
    if not key or not to_email:
        return False
    payload = {
        "from": {"email": from_email, "name": "Contact"},
        "to": [{"email": to_email}],
        "subject": f"New contact from {name}",
        "text": f"Name: {name}\nEmail: {email}\n\n{message}"
    }
    req = urllib.request.Request(
        'https://api.mailersend.com/v1/email',
        data=json.dumps(payload).encode('utf-8'),
        headers={'Authorization': f'Bearer {key}', 'Content-Type': 'application/json'}
    )
    try:
        with urllib.request.urlopen(req) as resp:
            return 200 <= resp.status < 300
    except Exception:
        return False

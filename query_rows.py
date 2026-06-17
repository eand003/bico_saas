import urllib.request
import json

url = 'https://mjouahzglomvvcfpxtuq.supabase.co'
anon = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qb3VhaHpnbG9tdnZjZnB4dHVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MzU3OTIsImV4cCI6MjA5MDIxMTc5Mn0.6SgPDABbRknn42mx1CnM67_P8O3Z7tqIGmQ7tn-M_bo'

headers = {
    'apikey': anon,
    'Authorization': f'Bearer {anon}'
}

for table in ['clientes', 'maquinas']:
    req_url = f"{url}/rest/v1/{table}?limit=10"
    req = urllib.request.Request(req_url, headers=headers)
    try:
        with urllib.request.urlopen(req) as r:
            data = json.loads(r.read().decode('utf-8'))
            print(f"Table '{table}' row count: {len(data)}")
            print("Rows:", data)
    except Exception as e:
        print(f"Error querying table '{table}':", e)

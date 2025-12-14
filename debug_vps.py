import paramiko
import json
import os

key_path = "vps_key"
os.chmod(key_path, 0o600)

host = "46.202.147.75"
user = "root"

try:
    key = paramiko.Ed25519Key.from_private_key_file(key_path)
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    print("Connecting...")
    client.connect(host, username=user, pkey=key)
    
    # Check docker ps
    print("--- Docker PS ---")
    cmd_ps = "docker ps --filter name=nextjs --format '{{.ID}} | {{.Names}} | {{.Status}} | {{.Ports}}'"
    stdin, stdout, stderr = client.exec_command(cmd_ps)
    print(stdout.read().decode())
    
    # Get ID
    cmd_id = "docker ps -q --filter name=nextjs"
    stdin, stdout, stderr = client.exec_command(cmd_id)
    cid = stdout.read().decode().strip().split('\n')[0]
    
    if cid:
        print(f"--- Labels for {cid} ---")
        cmd_inspect = f"docker inspect {cid} --format '{{{{json .Config.Labels}}}}'"
        stdin, stdout, stderr = client.exec_command(cmd_inspect)
        labels_json = stdout.read().decode()
        try:
            labels = json.loads(labels_json)
            print(json.dumps(labels, indent=2))
        except:
            print(labels_json)

        print("\n--- Recent Logs ---")
        cmd_logs = f"docker logs {cid} --tail 20"
        stdin, stdout, stderr = client.exec_command(cmd_logs)
        print(stdout.read().decode())
        print(stderr.read().decode())
        
        print(f"\n--- Health Status for {cid} ---")
        cmd_health = f"docker inspect {cid} --format '{{{{json .State.Health}}}}'"
        stdin, stdout, stderr = client.exec_command(cmd_health)
        health_json = stdout.read().decode()
        try:
            health = json.loads(health_json)
            # print only last 3 logs
            health['Log'] = health['Log'][-3:] if 'Log' in health else []
            print(json.dumps(health, indent=2))
        except:
            print(health_json)

except Exception as e:
    print(f"Error: {e}")
finally:
    client.close()

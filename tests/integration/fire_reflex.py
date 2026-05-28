import sys
import os
import json
import asyncio
from contextlib import redirect_stdout, redirect_stderr
import io

# Ensure src is in the path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from src.core.engine import handle_autonomous_response

async def main():
    with open('demo/breach_payload.json', 'r') as f:
        payload = json.load(f)
    
    # Capture stdout and stderr
    f_out = io.StringIO()
    f_err = io.StringIO()
    
    try:
        with redirect_stdout(f_out), redirect_stderr(f_err):
            print("--- TRIGGERING AUTONOMOUS RESPONSE ---")
            result = await handle_autonomous_response(payload['vector'], payload['logs'])
            print("--- RESPONSE COMPLETE ---")
            
        with open('demo/reflex_execution_trace.txt', 'w', encoding='utf-8') as f:
            f.write(f_out.getvalue())
            f.write(f_err.getvalue())
            
        with open('demo/reflex_response.json', 'w', encoding='utf-8') as f:
            clean_result = {}
            for k, v in result.items():
                if hasattr(v, 'model_dump'):
                    clean_result[k] = v.model_dump()
                elif hasattr(v, 'dict'):
                    clean_result[k] = v.dict()
                else:
                    clean_result[k] = v
            json.dump(clean_result, f, indent=4)
            
        print("Simulation complete. Outputs saved.")
    except Exception as e:
        print(f"Error during simulation: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())

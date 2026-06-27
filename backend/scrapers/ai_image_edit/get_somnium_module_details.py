import somnium
import inspect

for name, obj in inspect.getmembers(somnium):
    if inspect.isfunction(obj) or inspect.isclass(obj):
        try:
            print(f"--- {name} ---")
            print(inspect.getsource(obj))
        except:
            pass

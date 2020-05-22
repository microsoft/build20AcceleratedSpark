import os
import glob
from multiprocessing import Pool, cpu_count

path_root = os.path.expanduser(r"~/data/taxi_data")
files = glob.glob(os.path.join(path_root, "*.csv"))

def fixFile(f):
    print(f"Reading: {os.path.split(f)[1]}")
    with open(f, "r") as fd:
        lines = fd.readlines()

    if len(lines[0].split(',')) < 18:
        print(f"Will write: {os.path.split(f)[1]}")
        with open(f, "w") as fd:
            fd.writelines(lines[1:])

Pool(cpu_count()).map(fixFile, files)



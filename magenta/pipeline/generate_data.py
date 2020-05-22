from faker import Faker
import random as rnd
import os, argparse, logging, gzip, shutil
import pandas as pd
from multiprocessing import Pool
from functools import partial

logging.basicConfig(format='%(asctime)s  %(levelname)-10s %(message)s', datefmt="%Y-%m-%d-%H-%M-%S",
    level=logging.INFO)

def parse_args():
  ap = argparse.ArgumentParser()
  ap.add_argument("-o", "--outpath", default=".", help="Output for csv files")
  ap.add_argument("-n", "--n-files", default=5, type=int, help="number of files to generate")
  ap.add_argument("-s", "--file-size", default=15, type=float, help="file size, MB")
  ap.add_argument("--header", action="store_true", default=False, help="should keep header")
  ap.add_argument("--gzip", action="store_true", default=False, help="Should compress?")
  return ap.parse_args()

columns = (
  ["Text01", "Text02", "Text03", "Text04", "Text05", "Text06", "IntWritable01", "Text07", "Text08"] +
  ["Text09", "Text10", "Text11", "Text12", "Text13", "LongWritable01", "LongWritable02", "LongWritable03"] +
  ["LongWritable04", "LongWritable05", "LongWritable06", "Text14", "Text15", "IntWritable02", "Text16", "Text17", "Text18", "Text19", "Text20",] +
  ["IntWritable03", "IntWritable04", "Text21", "IntWritable05", "Text22", "Text23", "Text24", "Text25", "Text26", "IntWritable06"] +
  ["IntWritable07", "Text27", "IntWritable08", "Text28", "IntWritable09", "IntWritable10", "IntWritable11", "Text29", "Text30", "Text31"]
)

fake = Faker()

def get_date():
  return fake.date(pattern='%m:%d:%y %H:%M:%S:%f')[:-3]

def get_dec(a, b):
  return str(fake.pydecimal(left_digits=rnd.randint(a, b), right_digits=0))[:-2].replace('-', '')

def str_exact_chars(n):
  return fake.pystr(min_chars=n, max_chars=n)

def generate_record():
  Text01 = get_date()
  Text02 = get_date()
  Text03 = get_dec(1, 15)
  Text04 = str_exact_chars(3)
  Text05 = get_dec(1, 15)
  Text06 = fake.pystr_format(string_format='###-###-###-###-##{{random_int}}')[:-4]
  IntWriteable01 = get_dec(1, 1)
  Text07 = fake.pystr_format(string_format='###-###-###-###-####{{random_int}}')[:-2]
  Text08 = fake.ipv6()
  Text09 = fake.ipv6()
  Text10 = ''
  Text11 = get_dec(5, 5)
  Text12 = get_dec(5, 5)
  Text13 = get_dec(2, 2)
  LongWritable01 = get_dec(8, 12)
  LongWritable02 = get_dec(8, 12)
  LongWritable03 = get_dec(8, 12)
  LongWritable04 = get_dec(8, 12)
  LongWritable05 = get_dec(8, 12)
  LongWritable06 = get_dec(8, 12)
  Text14 = str_exact_chars(10)
  Text15 = str_exact_chars(10)
  IntWriteable02 = fake.pyint()
  Text16 = str_exact_chars(12)
  Text17 = fake.pystr_format(string_format='##{{random_int}}')
  Text18 = fake.ipv4()
  Text19 = str_exact_chars(3)
  Text20 = fake.pystr_format(string_format="???_?_??_???_????_?")
  IntWriteable03 = fake.pyint() 
  IntWriteable04 = fake.pyint() 
  Text21 = fake.pystr_format(string_format="#???###????###??")
  IntWriteable05 = fake.pyint() 
  Text22 = get_dec(1, 2)
  Text23 = ""
  Text24 = ""
  Text25 = fake.pystr_format(string_format="##|###|#####|###|##|####")
  Text26 = fake.pystr_format(string_format="##:#######:###:####")
  IntWriteable06 = fake.pyint()
  IntWriteable07 = fake.pyint()
  Text27 = fake.ipv6()
  IntWriteable08 = fake.pyint()
  Text28 = fake.ipv6()
  IntWriteable09 = fake.pyint()
  IntWriteable10 = fake.pyint()
  IntWriteable11 = fake.pyint()
  Text29 = ""
  Text30 = str_exact_chars(24)
  Text31 = ""

  data = ([Text01, Text02, Text03, Text04, Text05, Text06, IntWriteable01, Text07, Text08, Text09, Text10] + 
          [Text11, Text12, Text13, LongWritable01, LongWritable02, LongWritable03, LongWritable04, LongWritable05, LongWritable06] +
          [Text14, Text15, IntWriteable02, Text16, Text17, Text18, Text19, Text20, IntWriteable03, IntWriteable04, Text21] +
          [IntWriteable05, Text22, Text23, Text24, Text25, Text26, IntWriteable06, IntWriteable07, Text27, IntWriteable08] +
          [Text28, IntWriteable09, IntWriteable10, IntWriteable11, Text29, Text30, Text31]
          )

  return data

def generate_fake_data(file_size, header, out_path):
  size = 0
  data_dicts = []

  while size < file_size:

    data = generate_record()
    size += sum([len(str(x)) for x in data])
    data_dicts.append(dict(zip(columns, data)))

  df = pd.DataFrame(data_dicts)[columns]
  df.to_csv(out_path, index=False, header=columns if header else None)
  logging.info(f"Generated: {out_path}")

def gzip_file(file_path):

  dst_path = f"{file_path}.gz"

  with open(file_path, "rb") as fd:
    with gzip.open(dst_path, "wb") as gzfd:
      shutil.copyfileobj(fd, gzfd)

  os.remove(file_path)
  logging.info(f"Compressed: {dst_path}")

if __name__ == "__main__":
  args = parse_args()

  if not os.path.exists(args.outpath):
    os.makedirs(args.outpath)

  file_paths = [os.path.join(args.outpath, fake.pystr_format(string_format="??????????.csv")) for _ in range(args.n_files)]
  generator = partial(generate_fake_data, args.file_size * 1024 * 1024, args.header)

  d = generate_record()
  size = sum([len(str(x)) for x in d])
  logging.info(f"Record size: {size}")

  logging.info(f"Starting generation. Size: {args.file_size}. N-files {args.n_files}")
  Pool(processes=args.n_files).map(generator, file_paths)

  logging.info("Generation complete.")

  if args.gzip:
    logging.info("Starting compression")

    Pool(processes=args.n_files).map(gzip_file, file_paths)
    
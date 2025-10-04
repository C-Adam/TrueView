from detector import scan_file
import sys

def main():
    if len(sys.argv) < 2:
        print("No file provided")
        return

    file_path = sys.argv[1]

    print(f"Running detection on: {file_path}")
    print("Result:", scan_file(file_path))

main()

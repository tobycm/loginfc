import time

from smartcard.Exceptions import NoCardException
from smartcard.System import readers
from smartcard.util import toHexString

# Get all the available readers
r = readers()
if len(r) == 0:
    print("No readers available")

while len(r) == 0:
    time.sleep(1)
    r = readers()

# Use the first available reader
reader = r[0]
connection = reader.createConnection()

while True:
    try:
        connection.connect()
        break
    except NoCardException:
        print("No card detected")
        time.sleep(5)
        continue

# Command to read data from the card
FAST_READ_COMMAND = 0x3A

try:
    data, sw1, sw2 = connection.transmit([0x3A, 0x04, 0x14])
except Exception as e:
    print("Error:", e)

# Print the card content
print("Card data:", toHexString(data))
print("Status words:", sw1, sw2)

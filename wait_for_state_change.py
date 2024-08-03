import time

import smartcard.util
from smartcard.scard import (
    INFINITE, SCARD_E_NO_READERS_AVAILABLE, SCARD_S_SUCCESS, SCARD_SCOPE_USER,
    SCARD_STATE_ATRMATCH, SCARD_STATE_CHANGED, SCARD_STATE_EMPTY,
    SCARD_STATE_EXCLUSIVE, SCARD_STATE_IGNORE, SCARD_STATE_INUSE,
    SCARD_STATE_MUTE, SCARD_STATE_PRESENT, SCARD_STATE_UNAVAILABLE,
    SCARD_STATE_UNAWARE, SCARD_STATE_UNKNOWN, SCardEstablishContext,
    SCardGetErrorMessage, SCardGetStatusChange, SCardListReaders,
    SCardReleaseContext)

srTreeATR = [
    0x3B, 0x77, 0x94, 0x00, 0x00, 0x82, 0x30, 0x00, 0x13, 0x6C, 0x9F, 0x22
]
srTreeMask = [
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF
]


def printstate(state):
    reader, eventstate, atr = state
    print(reader + " " + smartcard.util.toHexString(atr, smartcard.util.HEX))
    if eventstate & SCARD_STATE_ATRMATCH:
        print("\tCard found")
    if eventstate & SCARD_STATE_UNAWARE:
        print("\tState unware")
    if eventstate & SCARD_STATE_IGNORE:
        print("\tIgnore reader")
    if eventstate & SCARD_STATE_UNAVAILABLE:
        print("\tReader unavailable")
    if eventstate & SCARD_STATE_EMPTY:
        print("\tReader empty")
    if eventstate & SCARD_STATE_PRESENT:
        print("\tCard present in reader")
    if eventstate & SCARD_STATE_EXCLUSIVE:
        print("\tCard allocated for exclusive use by another application")
    if eventstate & SCARD_STATE_INUSE:
        print("\tCard in used by another application but can be shared")
    if eventstate & SCARD_STATE_MUTE:
        print("\tCard is mute")
    if eventstate & SCARD_STATE_CHANGED:
        print("\tState changed")
    if eventstate & SCARD_STATE_UNKNOWN:
        print("\tState unknowned")


try:
    hresult, hcontext = SCardEstablishContext(SCARD_SCOPE_USER)
    if hresult != SCARD_S_SUCCESS:
        raise Exception(
            f"Failed to establish context: {SCardGetErrorMessage(hresult)}")
    print("Context established!")

    try:
        while True:
            hresult, readers = SCardListReaders(hcontext, [])

            if hresult == SCARD_E_NO_READERS_AVAILABLE:
                print("No readers available.")

            while hresult == SCARD_E_NO_READERS_AVAILABLE:
                time.sleep(1)
                hresult, readers = SCardListReaders(hcontext, [])
            if hresult != SCARD_S_SUCCESS:
                raise Exception(
                    f"Failed to list readers: {SCardGetErrorMessage(hresult)}")
            print("PCSC Readers:", readers)

            readerstates = [(reader, SCARD_STATE_UNAWARE)
                            for reader in readers]

            print("----- Current reader and card states are: -------")
            hresult, newstates = SCardGetStatusChange(hcontext, 0,
                                                      readerstates)
            for state in newstates:
                printstate(state)

            print("----- Please insert or remove a card ------------")
            hresult, newstates = SCardGetStatusChange(hcontext, INFINITE,
                                                      newstates)

            print("----- New reader and card states are: -----------")
            for state in newstates:
                printstate(state)

    except KeyboardInterrupt:
        print("Keyboard interrupt.")

    finally:
        hresult = SCardReleaseContext(hcontext)
        if hresult != SCARD_S_SUCCESS:
            raise Exception(
                f"Failed to release context: {SCardGetErrorMessage(hresult)}")

        print("Released context.")

except Exception as e:
    print(e)

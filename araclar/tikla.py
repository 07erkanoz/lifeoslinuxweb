#!/usr/bin/env python3
"""Sanal fare/klavye ile tıklama. Kullanim:
    python3 araclar/tikla.py tik <x> <y> [ekran_genislik] [ekran_yukseklik]
    python3 araclar/tikla.py tus <keycode>
/dev/uinput uzerinden gecici bir sanal aygit acar, isi bitince kapatir.
ydotool kurulu olmadigi icin yazildi; sisteme kalici hicbir sey birakmaz.
"""
import fcntl
import os
import struct
import sys
import time

UI_DEV_SETUP = 0x405c5503
UI_DEV_CREATE = 0x5501
UI_DEV_DESTROY = 0x5502
UI_SET_EVBIT = 0x40045564
UI_SET_KEYBIT = 0x40045565
UI_SET_ABSBIT = 0x40045567
UI_ABS_SETUP = 0x401c5504

EV_SYN, EV_KEY, EV_ABS = 0x00, 0x01, 0x03
SYN_REPORT = 0
BTN_LEFT = 0x110
ABS_X, ABS_Y = 0x00, 0x01
BUS_USB = 0x03


def _emit(fd, typ, code, val):
    os.write(fd, struct.pack("llHHi", 0, 0, typ, code, val))


def _syn(fd):
    _emit(fd, EV_SYN, SYN_REPORT, 0)


def _abs_setup(fd, code, maximum):
    # struct uinput_abs_setup: __u16 code; __u16 __pad; struct input_absinfo (6 x __s32)
    fcntl.ioctl(fd, UI_ABS_SETUP, struct.pack("HH6i", code, 0, 0, 0, maximum, 0, 0, 0))


def _create(fd, name, keys, with_abs, w=0, h=0):
    fcntl.ioctl(fd, UI_SET_EVBIT, EV_KEY)
    for k in keys:
        fcntl.ioctl(fd, UI_SET_KEYBIT, k)
    if with_abs:
        fcntl.ioctl(fd, UI_SET_EVBIT, EV_ABS)
        fcntl.ioctl(fd, UI_SET_ABSBIT, ABS_X)
        fcntl.ioctl(fd, UI_SET_ABSBIT, ABS_Y)
        _abs_setup(fd, ABS_X, w)
        _abs_setup(fd, ABS_Y, h)
    # struct uinput_setup: input_id (4 x __u16), char name[80], __u32 ff_effects_max
    fcntl.ioctl(fd, UI_DEV_SETUP,
                struct.pack("HHHH80sI", BUS_USB, 0x1234, 0x5678, 1, name.encode(), 0))
    fcntl.ioctl(fd, UI_DEV_CREATE)
    time.sleep(1.0)


def tik(x, y, w, h):
    fd = os.open("/dev/uinput", os.O_WRONLY | os.O_NONBLOCK)
    try:
        _create(fd, "lifeos-test-fare", [BTN_LEFT], True, w, h)
        _emit(fd, EV_ABS, ABS_X, x)
        _emit(fd, EV_ABS, ABS_Y, y)
        _syn(fd)
        time.sleep(0.3)
        _emit(fd, EV_KEY, BTN_LEFT, 1)
        _syn(fd)
        time.sleep(0.08)
        _emit(fd, EV_KEY, BTN_LEFT, 0)
        _syn(fd)
        time.sleep(0.3)
    finally:
        try:
            fcntl.ioctl(fd, UI_DEV_DESTROY)
        except OSError:
            pass
        os.close(fd)


def tus(code):
    fd = os.open("/dev/uinput", os.O_WRONLY | os.O_NONBLOCK)
    try:
        _create(fd, "lifeos-test-klavye", [code], False)
        _emit(fd, EV_KEY, code, 1)
        _syn(fd)
        time.sleep(0.05)
        _emit(fd, EV_KEY, code, 0)
        _syn(fd)
        time.sleep(0.2)
    finally:
        try:
            fcntl.ioctl(fd, UI_DEV_DESTROY)
        except OSError:
            pass
        os.close(fd)


RAKAM = {"1": 2, "2": 3, "3": 4, "4": 5, "5": 6, "6": 7, "7": 8, "8": 9, "9": 10,
         "0": 11, "-": 12, ".": 52, ",": 51}


def yaz(metin):
    kodlar = [RAKAM[c] for c in metin]
    fd = os.open("/dev/uinput", os.O_WRONLY | os.O_NONBLOCK)
    try:
        _create(fd, "lifeos-test-klavye", sorted(set(kodlar)), False)
        for k in kodlar:
            _emit(fd, EV_KEY, k, 1)
            _syn(fd)
            time.sleep(0.04)
            _emit(fd, EV_KEY, k, 0)
            _syn(fd)
            time.sleep(0.06)
        time.sleep(0.3)
    finally:
        try:
            fcntl.ioctl(fd, UI_DEV_DESTROY)
        except OSError:
            pass
        os.close(fd)


if __name__ == "__main__":
    if sys.argv[1] == "yaz":
        yaz(sys.argv[2])
    elif sys.argv[1] == "tik":
        tik(int(sys.argv[2]), int(sys.argv[3]),
            int(sys.argv[4]) if len(sys.argv) > 4 else 1920,
            int(sys.argv[5]) if len(sys.argv) > 5 else 1080)
    elif sys.argv[1] == "tus":
        tus(int(sys.argv[2]))
    else:
        sys.exit("bilinmeyen komut")

import requests
from bs4 import BeautifulSoup
import re

URL = "https://www.primbon.com/tanggal.htm"

HARI_NAMES = ["Hari Senin", "Hari Selasa", "Hari Rabu", "Hari Kamis", "Hari Jumat", "Hari Sabtu", "Hari Minggu"]
BULAN_NAMES = ["Bulan Januari", "Bulan Februari", "Bulan Maret", "Bulan April", "Bulan Mei",
               "Bulan Juni", "Bulan Juli", "Bulan Agustus", "Bulan September", "Bulan Oktober",
               "Bulan November", "Bulan Desember"]

def _get_soup():
    res = requests.get(URL, timeout=10)
    res.raise_for_status()
    return BeautifulSoup(res.content, "html.parser")

def _parse_b_sections(container, valid_titles):
    items = {}
    for b in container.find_all("b"):
        title = b.get_text(strip=True)
        if title not in valid_titles:
            continue
        desc_parts = []
        for sib in b.next_siblings:
            if sib.name == "b":
                break
            if sib.name is None:
                txt = str(sib).strip()
                if txt:
                    desc_parts.append(txt)
        items[title] = " ".join(desc_parts).strip()
    return items

def _parse_tanggal(div):
    items = {}
    for b in div.find_all("b"):
        title = b.get_text(strip=True)
        if not title.startswith("Tanggal "):
            continue
        num = title.replace("Tanggal ", "").strip()
        desc_parts = []
        for sib in b.next_siblings:
            if sib.name == "b":
                break
            if sib.name is None:
                txt = str(sib).strip()
                if txt:
                    desc_parts.append(txt)
        items[num] = " ".join(desc_parts).strip()
    return items

def _parse_bulan(div):
    items = {}
    for b in div.find_all("b"):
        title = b.get_text(strip=True)
        if title not in BULAN_NAMES:
            continue
        lines = []
        for sib in b.next_siblings:
            if sib.name == "b":
                break
            if sib.name is None:
                txt = str(sib).strip()
                if txt:
                    lines.append(txt)
        items[title] = lines
    return items

def get_tanggal_lahir(payload):
    hari  = payload.get("hari", "").strip()
    tgl   = payload.get("tanggal", "").strip()
    bulan = payload.get("bulan", "").strip()

    if not hari and not tgl and not bulan:
        return {"success": False, "error": "Minimal satu parameter (hari/tanggal/bulan) harus diisi"}

    try:
        soup = _get_soup()
    except Exception as e:
        return {"success": False, "error": str(e)}

    body_div = soup.find("div", id="body")
    div2     = soup.find("div", id="2")
    div3     = soup.find("div", id="3")

    result = {}

    if hari:
        hari_key = "Hari " + hari.capitalize()
        hari_map = _parse_b_sections(body_div, HARI_NAMES)
        if hari_key in hari_map:
            result["hari"] = {"nama": hari_key.replace("Hari ", ""), "sifat": hari_map[hari_key]}
        else:
            return {"success": False, "error": f"Hari '{hari}' tidak ditemukan. Gunakan: Senin, Selasa, Rabu, Kamis, Jumat, Sabtu, Minggu"}

    if tgl:
        tanggal_map = _parse_tanggal(div2)
        try:
            key = str(int(tgl))
        except ValueError:
            return {"success": False, "error": f"Tanggal '{tgl}' harus berupa angka 1–31"}
        if key in tanggal_map:
            result["tanggal"] = {"nomor": int(key), "penjelasan": tanggal_map[key]}
        else:
            return {"success": False, "error": f"Tanggal '{tgl}' tidak valid (1–31)"}

    if bulan:
        bulan_map = _parse_bulan(div3)
        bulan_key = "Bulan " + bulan.capitalize()
        if bulan_key in bulan_map:
            result["bulan"] = {"nama": bulan_key.replace("Bulan ", ""), "sifat": bulan_map[bulan_key]}
        else:
            return {"success": False, "error": f"Bulan '{bulan}' tidak ditemukan. Gunakan: Januari s/d Desember"}

    return {"success": True, "data": result}

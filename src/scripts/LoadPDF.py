import re
import json
import PyPDF2

def extraer_texto_con_pypdf2(pdf_path: str) -> str:
    texto = ""
    with open(pdf_path, "rb") as file:
        reader = PyPDF2.PdfReader(file)
        for page in reader.pages:
            texto += page.extract_text() + "\n"
    return texto

def extraer_rutina_desde_pdf(pdf_path: str, output_json: str):
    pdf_text = extraer_texto_con_pypdf2(pdf_path)

    # Separar por días de entrenamiento
    dias_regex = r"(PIERNA 1|TORSO 1|PIERNA 2|TORSO 2)"
    bloques = re.split(dias_regex, pdf_text)
    rutina = {}

    for i in range(1, len(bloques), 2):
        dia = bloques[i].strip()
        contenido = bloques[i + 1]
        ejercicios = []
        lineas = contenido.strip().splitlines()
        parsing = False

        for linea in lineas:
            if re.match(r"^\s*(realizar 12k pasos|RPE|¿CÓMO MEDIMOS)", linea, re.IGNORECASE):
                break
            if re.match(r"^\s*REPS\s+SETS\s+REST", linea, re.IGNORECASE):
                parsing = True
                continue
            if parsing and linea.strip():
                match = re.match(
                    r"^(.*?)\s+(\d{1,2}(?:-\d{1,2})?(?: x lado)?)\s+(\d{1,2})\s+([\d ]?min)\s+(FALLO|[0-9])\s+(.*)",
                    linea.strip(), re.IGNORECASE)
                if match:
                    ejercicio, reps, sets, rest, rir, tempo_raw = match.groups()

                    # Separar tempo y observaciones si están en la misma línea
                    tempo_y_obs = tempo_raw.strip()
                    tempo_match = re.match(r"(EXC|HOLD|CON): ?[\w\s\-]+?(seg)?", tempo_y_obs, re.IGNORECASE)
                    if tempo_match:
                        tempo_text = tempo_match.group().strip()
                        observaciones = tempo_y_obs[len(tempo_text):].strip()
                        tempo = tempo_text
                    else:
                        tempo = tempo_y_obs
                        observaciones = ""

                    ejercicios.append({
                        "ejercicio": ejercicio.strip(),
                        "reps": reps.strip(),
                        "sets": sets.strip(),
                        "rest": rest.strip(),
                        "rir": rir.strip(),
                        "tempo": tempo,
                        "observaciones": observaciones
                    })
                elif ejercicios:
                    # Agrega texto adicional a la observación del último ejercicio
                    ejercicios[-1]["observaciones"] += " " + linea.strip()

        rutina[dia] = ejercicios

    # Guardar JSON
    with open(output_json, "w", encoding="utf-8") as f:
        json.dump(rutina, f, ensure_ascii=False, indent=2)

    return rutina

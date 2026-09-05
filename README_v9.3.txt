Lernhelden v9.3 – Profil löschen Fix

Fehlerursache:
Ein Profil wurde lokal gelöscht, beim nächsten Laden aber erneut aus Supabase heruntergeladen.

Behoben:
- Löschen entfernt das Profil sofort lokal.
- Gleichzeitig wird eine Löschmarkierung gespeichert.
- Angemeldete Familienkonten löschen das Kind auch in Supabase.
- Ist das Gerät gerade offline, bleibt das Profil trotzdem verschwunden und die Cloud-Löschung wird beim nächsten Sync erneut versucht.
- Cloud Pull ignoriert Profile mit ausstehender Löschmarkierung.
- Cloud Push kann ein gelöschtes Profil nicht versehentlich wieder neu anlegen.
- Aktives Profil und lhKid werden nach dem Löschen korrekt aktualisiert bzw. entfernt.

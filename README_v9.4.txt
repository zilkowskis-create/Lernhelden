Lernhelden v9.4 – Profil bleibt gelöscht

Fehlerursache in v9.3:
Supabase kann bei einem DELETE ohne Fehler antworten, obwohl tatsächlich keine Zeile gelöscht wurde.
v9.3 hat daraufhin die lokale Löschmarkierung bereits entfernt. Beim nächsten Laden wurde das Profil
deshalb erneut aus der Cloud geladen.

v9.4:
- Nach jeder Cloud-Löschung wird geprüft, ob das Kinderprofil wirklich nicht mehr in Supabase existiert.
- Nur bei bestätigter Löschung wird die lokale Löschmarkierung entfernt.
- Existiert der Datensatz noch, bleibt die Löschmarkierung bestehen.
- Cloud Pull blendet markierte Profile weiterhin aus.
- Die Löschung wird bei jedem späteren Sync erneut versucht.
- Matching funktioniert sowohl über UUID als auch ersatzweise über Name + Klasse.

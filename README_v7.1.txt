Lernhelden v7.1
Verbessert für mehrere Familien:
- fehlende PWA-Dateien wieder vollständig enthalten
- Service Worker / Auto-Update repariert
- Eltern-PIN ergänzt
- Passwort-Reset ergänzt
- Supabase Tabellen/RLS für Familien, Kinder, Lernversuche, Lernzeiten und Einstellungen
- Hooks für automatische Speicherung von Lernversuchen und Lernzeit vorbereitet
- dynamische Kinderprofile bleiben Grundlage
Wichtig: config.js mit Project URL + Publishable Key ausfüllen. Niemals Secret/service_role verwenden.
In Supabase Auth > URL Configuration die GitHub-Pages-Adresse als Site URL und Redirect URL eintragen.

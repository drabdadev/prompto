# Prompto

Gestione prompt in colonne, con versioni web ed Electron.

- Per packaging e aggiornamenti leggere `docs/ELECTRON-IMPLEMENTATION.md` e `docs/PACKAGING-OPTIONS.md`; distinguere dati web, sviluppo Electron e applicazione installata. Il percorso effettivo è scelto da `DATABASE_PATH` e dal bootstrap Electron: non presumere isolamento dal solo comando usato.
- `better-sqlite3` deve essere ricompilato per il runtime destinatario. Gli script di sviluppo usano `setup:web` o `setup:electron`; nella build Windows preservare la ricompilazione prima del confezionamento, perché quella interna al builder può arrivare troppo tardi.
- Splash Windows: colore di sfondo pieno, non finestra trasparente. Per Electron conservare l'intera catena di altezza della pagina e `h-full`, evitando scorrimento superfluo.
- La distribuzione macOS non firmata usa download manuale del pacchetto; verificare il percorso di uscita dell'applicazione e gli artefatti di aggiornamento prima di cambiare rilascio. I dettagli dei singoli formati appartengono alla documentazione di packaging.
- Verifiche: `npm run test:server`; da `client/`, `npm run type-check`, `npm run lint`, `npm run build`. Per soli documenti controllare riferimenti.
- Backup, restore e cancellazione di progetti coinvolgono dati persistenti: verificare ambiente e istruzioni globali sui database prima delle mutazioni.
- Prima di gestire servizi locali leggere `~/.claude/docs/PORTS.md` e usare `lsmgr`.

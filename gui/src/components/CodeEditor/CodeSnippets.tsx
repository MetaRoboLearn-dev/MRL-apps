import { ReactNode } from "react";

export default function CodeSnippets() {
  return (
    <div className={'bg-white p-5 font-display'}>
      <h1 style={{ textAlign: "center", color: "#2c3e50" }}>
        Python podsjetnik za zadatke
      </h1>

      <Section title="Komentar">
        <p style={pStyle}>Komentar je tekst koji služi za objašnjenje dijelova programskog koda.</p>
        <p style={pStyle}><strong style={strongStyle}>Sintaksa</strong></p>
        <Pre>{`# tekst komentara`}</Pre>
        <p style={pStyle}><strong style={strongStyle}>Primjeri</strong></p>
        <Pre>{`# kretanje robota do prve kontrolne točke\n# provjera broja porcija hrane`}</Pre>
      </Section>

      <Section title="Varijable">
        <p style={pStyle}>Varijable služe za spremanje vrijednosti.</p>
        <p style={pStyle}><strong style={strongStyle}>Sintaksa</strong></p>
        <Pre>{`ime_varijable = vrijednost`}</Pre>
        <p style={pStyle}><strong style={strongStyle}>Primjeri</strong></p>
        <Pre>{`# broj porcija hrane\nhrana = 4\n\n# naziv životinje\nzivotinja = "lion"\n\n# informacija je li životinja pronađena\npronadjen = 0`}</Pre>
        <p style={pStyle}><strong style={strongStyle}>Promjena vrijednosti</strong></p>
        <Pre>{`# povećavamo vrijednost varijable hrana\nhrana = hrana + 1\n\n# smanjujemo vrijednost varijable zivotinja (kraći zapis)\nbroj_zivotinja -= 1`}</Pre>
      </Section>

      <Section title="Kretanje robota">
        <p style={pStyle}>Robot se može kretati po stazi i okretati za 90 stupnjeva u lijevu ili desnu stranu.</p>
        <p style={pStyle}><strong style={strongStyle}>Osnovne naredbe</strong></p>
        <Pre>{`forward()      # robot ide naprijed\nbackward()     # robot ide natrag\nturn_left()    # robot se okrene lijevo za 90°\nturn_right()   # robot se okrene desno za 90°`}</Pre>
        <p style={pStyle}><strong style={strongStyle}>Primjer</strong></p>
        <Pre>{`# robot treba preći put zadan sljedećim koracima\n# NAPRIJED - NAPRIJED - OKRET LIJEVO - NAPRIJED\nforward()\nforward()\nturn_left()\nforward()`}</Pre>
      </Section>

      <Section title="Prikaz na LED zaslonu (ispis)">
        <p style={pStyle}>Na LED zaslonu robota može se ispisati tekst ili jedan znak. <b>Znak</b> ostaje prikazan dok se zaslon ne obriše.</p>
        <p style={pStyle}><strong style={strongStyle}>Sintaksa</strong></p>
        <Pre>{`# ispis zadanog teksta\ndisplay_text("tekst")\n\n#ispis vrijednosti varijable\ndisplay_text(varijabla)\n\n#prikaz znaka\ndisplay_char(znak)\n\n# LED ekran svijetli \ndisplay_green()    #zeleno\ndisplay_red()      #crveno\n\n# brisanje ekrana\ndisplay_clear()\n\n# vrijeme čekanja (n je broj sekundi)\nsleep(n)`}</Pre>
        <p style={pStyle}><strong style={strongStyle}>Primjeri</strong></p>
        <Pre>{`# tekstualna poruka\nime_zivotinje="dog"\ndisplay_text("Hranjenje:")\ndisplay_text(ime_zivotinje)  \n\n# prikaz prvog slova imena\nime = "Ana"\ndisplay_char(ime[0])\n\n# ispis vrijednosti varijable porcije u trajanju od 3 sekunde nakon čega se briše LED zaslon\ndisplay_char(porcije)\nsleep(3)\ndisplay_clear()`}</Pre>
      </Section>

      <Section title="Uvjeti (if)">
        <p style={pStyle}>Koristi se za donošenje odluka u programu.</p>
        <p style={pStyle}><strong style={strongStyle}>Sintaksa</strong></p>
        <Pre>{`if uvjet:\n    naredbe\nelse:\n    naredbe`}</Pre>
        <p style={pStyle}><strong style={strongStyle}>Primjer</strong></p>
        <Pre>{`zivotinja = "lion"\n\nif zivotinja == "lion":\n    display_text("Kralj životinja")\nelse:\n    display_text("Životinja")`}</Pre>
        <p style={pStyle}><strong style={strongStyle}>Operatori usporedbe</strong></p>
        <Pre>{`==   jednako\n!=   nije jednako\n>    veće\n<    manje\n>=   veće ili jednako\n<=   manje ili jednako`}</Pre>
        <p style={pStyle}><strong style={strongStyle}>VAŽNO:</strong> Potrebno je koristiti uvlake.</p>
        <p style={pStyle}><strong style={strongStyle}>Ispravno</strong></p>
        <Pre>{`if hrana > 0:\n    display_text("Ima hrane")`}</Pre>
        <p style={pStyle}><strong style={strongStyle}>Pogrešno</strong></p>
        <Pre>{`if hrana > 0:\ndisplay_text("Ima hrane")`}</Pre>
      </Section>

      <Section title="Naredbe ponavljanja (petlje)">
        <p style={pStyle}>
          Petlje služe za ponavljanje jedne ili više naredbi.<br />
          <strong style={strongStyle}>Petlju for</strong> koristimo kada znamo koliko puta se nešto ponavlja.<br />
          <strong style={strongStyle}>Petlju while</strong> koristimo kada se ponavljanje događa dok je neki uvjet ispunjen.
        </p>
        <p style={pStyle}><strong style={strongStyle}>Petlja for</strong></p>
        <p style={pStyle}><strong style={strongStyle}>Sintaksa</strong></p>
        <Pre>{`for i in range(broj):\n    naredbe`}</Pre>
        <p style={pStyle}><strong style={strongStyle}>Primjer</strong></p>
        <Pre>{`# tri koraka naprijed\nfor i in range(3):\n    forward()`}</Pre>
        <p style={pStyle}><strong style={strongStyle}>Petlja while</strong></p>
        <p style={pStyle}><strong style={strongStyle}>Sintaksa</strong></p>
        <Pre>{`while uvjet:\n    naredbe`}</Pre>
        <p style={pStyle}><strong style={strongStyle}>Primjer</strong></p>
        <Pre>{`# robot ide naprijed dok ima hrane\nwhile hrana > 0:\n    forward()\n    hrana -= 1`}</Pre>
      </Section>

      <Section title="Prepoznavanje slike (image recognition)">
        <p style={pStyle}>Robot može prepoznati objekt na polju ispred sebe.</p>
        <p style={pStyle}><strong style={strongStyle}>Sintaksa</strong></p>
        <Pre>{`naziv_varijable = detect_object()`}</Pre>
        <p style={pStyle}><strong style={strongStyle}>Primjer</strong></p>
        <Pre>{`# robot prepoznaje objekt i ispisuje poruku ovisno o tome što je prepoznao\nzivotinja = detect_object()\nif zivotinja == "lion":\n    display_text("Velika zivotinja")\nelse:\n    display_text("Zivotinja")`}</Pre>
      </Section>

      <Section title="Liste">
        <p style={pStyle}>Lista je struktura u koju se može spremiti više vrijednosti.</p>
        <p style={pStyle}><strong style={strongStyle}>Sintaksa</strong></p>
        <Pre>{`naziv_liste = [vrijednost1, vrijednost2, vrijednost3]`}</Pre>
        <p style={pStyle}><strong style={strongStyle}>Primjeri</strong></p>
        <Pre>{`# lista životinja\npopis_zivotinja = ["lion", "tiger", "elephant"]\n\n# lista brojeva\nporcije = [1, 2, 3, 4]`}</Pre>
        <p style={pStyle}><strong style={strongStyle}>Pristup elementu liste</strong></p>
        <p style={pStyle}>Elementima liste pristupa se pomoću indeksa. Prvi element ima indeks 0.</p>
        <Pre>{`popis_zivotinja = ["lion", "tiger", "elephant"]\n\n# ispis prvog elementa liste\ndisplay_text(popis_zivotinja[0])`}</Pre>
        <p style={pStyle}><strong style={strongStyle}>Promjena vrijednosti elementa liste</strong></p>
        <Pre>{`porcije = [3, 2, 3]\n\n# promjena drugog elementa\nporcije[1] = 5`}</Pre>
        <p style={pStyle}><strong style={strongStyle}>Ispis svih elemenata liste</strong></p>
        <Pre>{`popis_zivotinja = ["lion", "tiger", "elephant"]\n\nfor zivotinja in popis_zivotinja:\n    display_char(zivotinja)`}</Pre>
      </Section>

      <Section title="Funkcije">
        <p style={pStyle}>Funkcija je skup naredbi koje možemo spremiti pod jednim imenom i pozvati ih kada želimo.</p>
        <p style={pStyle}>Funkcije se koriste kako bismo organizirali kod i izbjegli ponavljanje istih naredbi.</p>
        <p style={pStyle}><strong style={strongStyle}>Sintaksa</strong></p>
        <Pre>{`def naziv_funkcije():\n    naredbe`}</Pre>
        <p style={pStyle}>Nakon što je funkcija definirana, potrebno ju je <strong style={strongStyle}>pozvati</strong>.</p>
        <Pre>{`naziv_funkcije()`}</Pre>
        <p style={pStyle}><strong style={strongStyle}>Primjer</strong></p>
        <Pre>{`# funkcija koja pomiče robota naprijed tri puta\ndef tri_koraka():\n    forward()\n    forward()\n    forward()\n# pozivanje funkcije\ntri_koraka()`}</Pre>
        <p style={pStyle}><strong style={strongStyle}>Funkcija s parametrima</strong></p>
        <p style={pStyle}>Funkcija može primiti vrijednosti (parametre) koje koristi unutar funkcije.</p>
        <p style={pStyle}><strong style={strongStyle}>Sintaksa</strong></p>
        <Pre>{`def naziv_funkcije(parametar):\n    naredbe`}</Pre>
        <p style={pStyle}><strong style={strongStyle}>Primjer</strong></p>
        <Pre>{`# funkcija koja ispisuje ime životinje\ndef ispisi_zivotinju(ime):\n    display_text("Zivotinja:")\n    display_text(ime)\n# pozivanje funkcije\nispisi_zivotinju("lion")`}</Pre>
        <p style={pStyle}><strong style={strongStyle}>Primjer funkcije za kretanje robota</strong></p>
        <Pre>{`# funkcija za okretanje robota i pomak naprijed\ndef skretanje():\n    turn_left()\n    forward()\n# korištenje funkcije\nskretanje()`}</Pre>
      </Section>
    </div>
  );
}

const pStyle: React.CSSProperties = { marginTop: "12px" };
const strongStyle: React.CSSProperties = { color: "#333" };

const sectionHeadingStyle: React.CSSProperties = {
  marginTop: "35px",
  borderBottom: "2px solid #dcdcdc",
  paddingBottom: "5px",
  fontSize: "24px",
  color: "#1f4e79",
};

const preStyle: React.CSSProperties = {
  background: "#f6f8fa",
  marginTop: "5px",
  padding: "12px",
  borderRadius: "6px",
  fontFamily: 'Consolas, "Courier New", monospace',
  fontSize: "14px",
  overflowX: "auto",
  whiteSpace: "pre-wrap",
  lineHeight: 1.6,
};

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <h1 style={sectionHeadingStyle}>{title}</h1>
      {children}
    </>
  );
}

function Pre({ children }: { children: ReactNode }) {
  return <pre style={preStyle}>{children}</pre>;
}
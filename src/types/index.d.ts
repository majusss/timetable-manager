export interface Budynek {
  id: string;
  nazwa: string;
  pietra?: Pietro[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Pietro {
  id: string;
  numer: number;
  budynekId: string;
  budynek?: Omit<Budynek, "pietra">;
  sale?: Sala[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Sala {
  id: string;
  nazwa: string;
  liczbaMiejsc: number;
  pietroId: string;
  pietro?: Pietro;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Przedmiot {
  id: string;
  nazwa: string;
  waga: number;
  nauczyciele?: Nauczyciel[];
  przedmiotyOddział?: PrzedmiotOddzial[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Nauczyciel {
  id: string;
  nazwa: string;
  skrot: string;
  przedmioty?: Przedmiot[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Oddzial {
  id: string;
  nazwa: string;
  przedmiotyOddział?: PrzedmiotOddzial[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PrzedmiotOddzial {
  id: string;
  przedmiotId: string;
  oddzialId: string;
  godzTygodnia: number;
  przedmiot?: Przedmiot;
  oddzial?: Oddzial;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Budynek {
  id: string;
  nazwa: string;
  pietra: {
    id: string;
    numer: number;
    budynekId: string;
    sale: {
      id: string;
      nazwa: string;
      liczbaMiejsc: number;
      pietroId: string;
    }[];
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Pietro {
  id: string;
  numer: number;
  budynekId: string;
  budynek: Omit<Budynek, "pietra">;
  sale: Sala[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Sala {
  id: string;
  nazwa: string;
  liczbaMiejsc: number;
  pietroId: string;
  pietro: {
    id: string;
    numer: number;
    budynekId: string;
    budynek: {
      id: string;
      nazwa: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Przedmiot {
  id: string;
  nazwa: string;
  waga: number;
  nauczyciele: Nauczyciel[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Nauczyciel {
  id: string;
  nazwa: string;
  skrot: string;
  przedmioty: Przedmiot[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Oddzial {
  id: string;
  nazwa: string;
  liczbaLekcjiTygodnia: number;
  createdAt: Date;
  updatedAt: Date;
}

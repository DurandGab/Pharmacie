export class Medicament {
    constructor(id, denomination, formepharmaceutique, photo, qte) {
        this.id = id;
        this.denomination = denomination;
        this.formepharmaceutique = formepharmaceutique;
        this.photo = photo;
        this.qte = qte;
    }

    getId() {
        return this.id;
    }

    getDenomination() {
        return this.denomination;
    }

    getFormepharmaceutique() {
        return this.formepharmaceutique;
    }

    getPhoto() {
        return this.photo;
    }

    getQte() {
        return this.qte;
    }
    displayMedicament() {
        return `${this.denomination}. Forme :  (${this.formepharmaceutique}). Quantité : ${this.qte}`;
    }
}
export default Medicament;
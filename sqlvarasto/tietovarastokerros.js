'use strict';

// Haku
const { STATUSKOODIT, STATUSVIESTIT } = require('./statuskoodit');
const tietokanta = require('./tietokanta');
const optiot = require('./yhteysoptiot.json');
const sql = require('./sqllauseet.json');

// Haku SQL:stä
const haeKaikkiSql = sql.haeKaikki.join(' ');
const haeSatunnaisetSql = sql.haeSatunnaiset.join(' ');
const haeKategoria = sql.haeKategoria.join(' ');

const PERUSAVAIN = sql.perusavain;

// TietovarastoLuokka //

module.exports = class Tietovarasto {
    constructor() {
        this.db = new tietokanta(optiot);
    }

    get STATUSKOODIT() {
        return STATUSKOODIT;
    };

    // Kaikki
    haeKaikki() {
        return new Promise(async (resolve, reject) => {
            try {
                const tulos = await this.db.suoritaKysely(haeKaikkiSql);
                resolve(tulos.kyselyTulos);
            }
            catch (virhe) {
                console.log(virhe);
                reject(STATUSVIESTIT.OHJELMAVIRHE());
            }
        })
    }

    // Satunnaiset
    haeSatunnaiset() {
        return new Promise(async (resolve, reject) => {
            try {
                const tulos = await this.db.suoritaKysely(haeSatunnaisetSql);
                resolve(tulos.kyselyTulos);
            }
            catch (virhe) {
                console.log(virhe);
                reject(STATUSVIESTIT.OHJELMAVIRHE());
            }
        })
    }

    // Test
    haeKategoria(kategoria) {
        return new Promise(async (resolve, reject) => {
            if (!kategoria) {
                reject(STATUSVIESTIT.EI_LOYTYNYT('-- tyhjä --'));
            }
            else {
                try {
                    const tulos = await this.db.suoritaKysely(haeKategoria, [kategoria]);
                    if (tulos.kyselyTulos.length > 0) {
                        resolve(tulos.kyselyTulos);
                    }
                    else {
                        reject(STATUSVIESTIT.EI_LOYTYNYT(kategoria))
                    }
                }
                catch (virhe) {
                    reject(STATUSVIESTIT.OHJELMAVIRHE());
                }
            }
        });
    }
}
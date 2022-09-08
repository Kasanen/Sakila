'use strict';

// Haku
const mariadb = require('mariadb');

// TietokantaLuokka
module.exports = class tietokanta{
    constructor(optiot){
        this.optiot = optiot;
    }

    suoritaKysely(sql, parametrit){
        return new Promise(async (resolve, reject) => {
            let yhteys;
            try{
                yhteys = await mariadb.createConnection(this.optiot);
                let kyselyTulos = await yhteys.query(sql, parametrit);
                
                if(typeof kyselyTulos === 'undefined'){
                    reject('Kyselyvirhe');
                }
                else if(typeof kyselyTulos.affectedRows === 'undefined'){
                    delete kyselyTulos.meta;
                    resolve({kyselyTulos, tulosjoukko:true});
                }
                else{
                    resolve({
                        kyselyTulos:{
                            muutetutRivitLkm: kyselyTulos.affectedRows,
                            insertId: kyselynTulos.insertId,
                            status: kyselyTulos.warningStatus
                        },
                        tulosjoukko: false
                    });
                }
            }
            catch(virhe){
                reject('SQL-virhe' + virhe);
            }
            finally{
                if(yhteys) yhteys.end();
            }
        });
    }
}
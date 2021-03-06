"use strict";

var mongoose = require('mongoose');

//Estructura del modelo
//
var anuncioSchema = mongoose.Schema({
	nombre: String,
	descripcion: String,
	esVenta: Boolean,
	precio: Number, 
	foto: String,
	tags: [String]
});

anuncioSchema.index({ nombre:1 });
anuncioSchema.index({ esVenta:1 });
anuncioSchema.index({ precio:1 });
anuncioSchema.index({ tags:1 });


//Métodos específicos del modelo
//
anuncioSchema.statics.lista = function(filter, params) {
	return new Promise(function(resolve, reject) {
		var query = Anuncio.find(filter);
		query.sort(params.sort);
		query.select(params.fields);
		query.limit(params.limit);
		query.skip(params.skip);

		
		query.exec(function(err, listado){
			if (err) {
				reject(err);
				return;
			}
			if (params.count) {
				var qCount=Anuncio.find(filter);
				qCount.count(true);
				qCount.exec(function(err, total){
					if (err) {
						reject(err);
						return;
					}
					resolve({total: total, listado });
				});
				
			} else {
				resolve(listado);
			}
		});

	});
};

anuncioSchema.statics.tags = function() {
	return new Promise(function(resolve, reject) {
		var query = Anuncio.find().distinct('tags', function(err, etiquetas){
			if (err) {
				reject(err);
				return;
			}
			
			resolve(etiquetas);
			
		});
	});
};

//'Exportación' del modelo
//
var Anuncio = mongoose.model('Anuncio', anuncioSchema);
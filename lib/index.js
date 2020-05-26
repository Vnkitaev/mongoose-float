'use strict';

var mongoose = require('mongoose');
var util = require('util');
var CastError = mongoose.SchemaType.CastError;

function FloatType(digits) {
	function Float(path, options) {
		this.path = path;
		mongoose.SchemaTypes.Number.call(this, path, options);
	}

	util.inherits(Float, mongoose.SchemaTypes.Number);

	Float.prototype.cast = function(value) {
		if (value == null || value === '') {
			return null;
		}

		if (typeof value === 'string' || typeof value === 'boolean') {
			value = Number(value);
		}

		if (isNaN(value)) return new CastError('Number', value, this.path);

		return Number(value.toFixed(digits || 2));
	};

	Float._checkRequired = value => typeof value === 'number' || value instanceof Number;

	return Float;
}

module.exports.loadType = function(mongoose, digits) {
	var floatType = new FloatType(digits);

	if (mongoose.Schema && typeof mongoose.Schema.Types === 'object') {
		mongoose.Schema.Types.Float = floatType;
	}

	if (typeof mongoose.SchemaTypes === 'object') {
		mongoose.SchemaTypes.Float = floatType;
	}

	if (typeof mongoose.Types === 'object') {
		mongoose.Types.Float = floatType;
	}

	return floatType;
};

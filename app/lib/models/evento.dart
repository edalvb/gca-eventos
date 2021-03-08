import 'package:cloud_firestore/cloud_firestore.dart';

class Evento {
  String _id;
  String _descripcion;
  String _imagenDestacada;
  String _titulo;
  DateTime _fecha;

  String get id => _id;
  String get descripcion => _descripcion;
  DateTime get fecha => _fecha;
  String get titulo => _titulo;
  String get imagenDestacada => _imagenDestacada;

  Evento.fromDocumentSnapshot(DocumentSnapshot ds)
      : _id = ds.id,
        _descripcion = ds['descripcion'],
        _fecha = DateTime.fromMicrosecondsSinceEpoch(
            (ds['fecha'] as Timestamp).microsecondsSinceEpoch),
        _imagenDestacada = ds['imagenDestacada'],
        _titulo = ds['titulo'];
}

import 'package:flutter/material.dart';
import 'package:app/models/evento.dart';

class ConfirmarPage extends StatefulWidget {
  final Evento evento;

  ConfirmarPage({this.evento});

  @override
  _ConfirmarPageState createState() => _ConfirmarPageState();
}

class _ConfirmarPageState extends State<ConfirmarPage> {
  final _formKey = GlobalKey<FormState>();
  int adultos;
  int menores;
  String asistentes;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(2),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              Text(
                widget.evento.titulo.toUpperCase(),
                style: Theme.of(context).textTheme.headline3,
                textAlign: TextAlign.center,
              ),
              Padding(
                padding: const EdgeInsets.all(8),
                child: Text(
                  'Confirmar Asistencia',
                  style: Theme.of(context).textTheme.headline6,
                  textAlign: TextAlign.center,
                ),
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  numberWidget(
                    "Adultos",
                    "1",
                    checkAdultos,
                    (value) => {this.adultos = int.parse(value)},
                  ),
                  numberWidget(
                    "Menores",
                    "0",
                    checkMenores,
                    (value) => {this.menores = int.parse(value)},
                  ),
                ],
              ),
              textArea(
                "Nombres de Asistentes",
                4,
                checkAsistentes,
                    (value) => {this.asistentes = value},
              ),
              OutlinedButton(
                child: Text("Enviar confirmación"),
                // textColor: Theme.of(context).primaryColor,
                onPressed: enviarConfirmacion,
              )
            ],
          ),
        ),
      ),
    );
  }

  Widget numberWidget(String label, initialValue, validator, onSave) {
    return SizedBox(
      child: TextFormField(
        initialValue: initialValue,
        validator: validator,
        onSaved: onSave,
        style: TextStyle(fontSize: 20),
        keyboardType: TextInputType.number,
        decoration: InputDecoration(labelText: label),
      ),
      width: 100,
    );
  }

  Widget textArea(String label, int lines, validator, onSaved) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Container(
        // width: 100,
        child: TextFormField(
          onSaved: onSaved,
          validator: validator,
          style: TextStyle(fontSize: 20),
          keyboardType: TextInputType.multiline,
          maxLines: lines,
          decoration: InputDecoration(labelText: label),
        ),
      ),
    );
  }

  String checkAdultos(String value) {
    int adultos = int.tryParse(value);
    if (adultos == null) {
      return "Número no válido";
    }
    if (adultos <= 0) {
      return "Al menos 1 adulto";
    }
    return null;
  }

  String checkMenores(String value) {
    int menores = int.tryParse(value);
    if (menores == null) {
      return "Número no válido";
    }
    return null;
  }

  String checkAsistentes(String value) {
    if (value.isEmpty) {
      return "Indica los asistentes";
    }
    return null;
  }

  enviarConfirmacion() {
    if (_formKey.currentState.validate()) {
      _formKey.currentState.save();
      print("Adultos: ${this.adultos}");
      print("Menores: ${this.menores}");
      print("Asistentes: ${this.asistentes}");
    }
  }
}

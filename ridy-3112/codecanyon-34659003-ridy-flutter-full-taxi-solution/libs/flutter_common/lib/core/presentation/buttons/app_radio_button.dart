import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_common/core/color_palette/color_palette.dart';

class AppRadioButton<T> extends StatelessWidget {
  final T groupValue;
  final T value;
  final Function(T value) onChanged;

  const AppRadioButton({
    super.key,
    required this.groupValue,
    required this.value,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return CupertinoButton(
        minSize: 0,
        padding: EdgeInsets.zero,
        child: Container(
          padding: const EdgeInsets.all(4),
          decoration: BoxDecoration(
            color: groupValue == value ? ColorPalette.primary40 : Colors.transparent,
            shape: BoxShape.circle,
            border: groupValue == value ? null : Border.all(color: ColorPalette.primary95),
          ),
          child: const Icon(
            Icons.check,
            size: 14,
            color: Colors.white,
          ),
        ),
        onPressed: () => onChanged(value));
  }
}

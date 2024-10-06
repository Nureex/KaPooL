import 'package:flutter/material.dart';
import 'package:ionicons/ionicons.dart';
import 'package:flutter_common/core/color_palette/color_palette.dart';

class RoundedCheckbox extends StatelessWidget {
  final bool isSelected;

  const RoundedCheckbox({
    super.key,
    required this.isSelected,
  });

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 200),
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: isSelected ? ColorPalette.primary40 : ColorPalette.neutralVariant99,
        border: isSelected ? null : Border.all(color: ColorPalette.primary95),
      ),
      width: 20,
      height: 20,
      child: isSelected
          ? const Icon(
              Ionicons.checkmark,
              size: 12,
              color: ColorPalette.neutralVariant99,
            )
          : const SizedBox(),
    );
  }
}

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_common/core/color_palette/color_palette.dart';
import 'package:flutter_common/core/extensions/extensions.dart';

class AppTextButton extends StatelessWidget {
  final String text;
  final IconData? iconData;
  final Function() onPressed;
  final int? badge;
  final Color color;
  final bool isDisabled;
  final bool isPrimary;
  final bool isDense;

  const AppTextButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.iconData,
    this.badge,
    this.color = ColorPalette.primary30,
    this.isDisabled = false,
    this.isPrimary = false,
    this.isDense = false,
  });

  @override
  Widget build(BuildContext context) {
    return CupertinoButton(
        minSize: isDense ? 0 : null,
        padding: isDense ? EdgeInsets.zero : null,
        onPressed: isDisabled ? null : onPressed,
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (iconData != null) ...[
              Badge(
                label: (badge == null || badge == 0) ? null : Text(badge!.toString()),
                isLabelVisible: badge != null && badge != 0,
                child: Icon(
                  iconData,
                  color: color,
                ),
              ),
              const SizedBox(width: 6),
            ],
            Text(
              text,
              style: isPrimary
                  ? context.titleSmall?.copyWith(color: textColor)
                  : context.bodyMedium?.copyWith(
                      color: textColor,
                    ),
            ),
          ],
        ));
  }

  Color get textColor => isDisabled ? ColorPalette.neutralVariant50 : color;
}

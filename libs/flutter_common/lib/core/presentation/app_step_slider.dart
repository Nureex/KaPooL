import 'package:flutter/material.dart';
import 'package:flutter_common/core/color_palette/color_palette.dart';
import 'package:flutter_common/gen/assets.gen.dart';

class AppStepSlider extends StatelessWidget {
  final GlobalKey widgetKey = GlobalKey();
  final int count;
  final int currentStep;

  AppStepSlider({
    super.key,
    required this.count,
    required this.currentStep,
  });

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Padding(
          padding: const EdgeInsets.only(
            top: 18,
            bottom: 18,
          ),
          child: Row(
            children: List.generate(
              count,
              (index) {
                return Expanded(
                  child: AnimatedContainer(
                    height: 4,
                    margin: const EdgeInsets.symmetric(horizontal: 2),
                    decoration: BoxDecoration(
                      color: index == currentStep ? ColorPalette.primary50 : ColorPalette.neutral80,
                      borderRadius: BorderRadius.circular(2),
                    ),
                    duration: const Duration(milliseconds: 300),
                  ),
                );
              },
            ),
          ),
        ),
        AnimatedPositioned(
          curve: Curves.easeInOut,
          left: 46 * currentStep.toDouble(),
          duration: const Duration(
            milliseconds: 300,
          ),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 3),
            child: Transform.rotate(
              angle: 1.5708,
              child: Assets.images.carTopView.image(
                width: 40,
                height: 40,
                fit: BoxFit.contain,
              ),
            ),
          ),
        )
      ],
    );
  }
}

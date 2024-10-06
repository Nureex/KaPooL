import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_common/core/extensions/extensions.dart';
import 'package:flutter_common/features/country_code_dialog/country_code.dart';
import 'package:ionicons/ionicons.dart';
import 'package:flutter_common/core/color_palette/color_palette.dart';

import '../dialogs/app_country_code_list_dialog.dart';

class AppPhoneNumberTextField extends StatelessWidget {
  final Function((CountryCode, String?)?)? onChanged;
  final Function((CountryCode, String?)?)? onSaved;
  final (CountryCode, String?) initalValue;
  final String? Function((CountryCode, String?)?)? validator;
  final String? errorText;

  const AppPhoneNumberTextField({
    super.key,
    required this.initalValue,
    this.onChanged,
    this.validator,
    this.errorText,
    this.onSaved,
  });

  @override
  Widget build(BuildContext context) {
    return FormField<(CountryCode, String?)>(
      initialValue: initalValue,
      validator: validator,
      onSaved: onSaved,
      builder: (state) => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              CupertinoButton(
                padding: const EdgeInsets.all(0),
                minSize: 0,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
                  decoration: BoxDecoration(
                    color: ColorPalette.primary99,
                    border: Border.all(color: ColorPalette.primary95, width: 1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Image.asset(
                        state.value!.$1.image,
                        width: 24,
                        height: 24,
                        filterQuality: FilterQuality.high,
                        isAntiAlias: true,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        state.value!.$1.e164CC,
                        style: context.bodyMedium,
                      ),
                      const SizedBox(width: 8),
                      const Icon(
                        Ionicons.chevron_forward,
                        size: 16,
                        color: ColorPalette.neutral70,
                      ),
                    ],
                  ),
                ),
                onPressed: () async {
                  final countryCodeDialogResult = await showDialog<CountryCode>(
                    context: context,
                    useSafeArea: false,
                    builder: (context) {
                      return const AppCountryCodeListDialog();
                    },
                  );
                  if (countryCodeDialogResult != null) {
                    state.didChange((countryCodeDialogResult, state.value!.$2));
                    onChanged?.call((countryCodeDialogResult, state.value!.$2));
                  }
                },
              ),
              const SizedBox(width: 8),
              Expanded(
                child: TextFormField(
                  keyboardType: TextInputType.phone,
                  inputFormatters: [
                    FilteringTextInputFormatter.digitsOnly,
                  ],
                  style: context.bodyMedium,
                  initialValue: state.value?.$2,
                  decoration: InputDecoration(
                    hintText: "Enter phone number",
                    errorText: state.errorText ?? errorText,
                    isDense: true,
                  ),
                  onChanged: (value) {
                    state.didChange((state.value!.$1, value));
                    onChanged?.call((state.value!.$1, value));
                  },
                ),
              ),
            ],
          ),
          const SizedBox(
            height: 16,
          )
        ],
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:rider_flutter/l10n/messages.dart';

export 'package:flutter_common/core/extensions/extensions.dart';

extension Translations on BuildContext {
  S get translate => S.of(this);
}

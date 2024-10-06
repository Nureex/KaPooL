import 'package:flutter/material.dart';
import 'package:ionicons/ionicons.dart';

enum AddressType {
  home,
  work,
  partner,
  gym,
  parent,
  cafe,
  park,
  other,
}

extension AddressTypeX on AddressType {
  String name(BuildContext context) {
    switch (this) {
      case AddressType.home:
        return 'Home';
      case AddressType.work:
        return 'Work';
      case AddressType.partner:
        return 'Partner\'s place';
      case AddressType.gym:
        return 'Gym';
      case AddressType.parent:
        return 'Parent\'s place';
      case AddressType.cafe:
        return 'Cafe';
      case AddressType.park:
        return 'Park';
      case AddressType.other:
        return 'Other';
    }
  }

  IconData get icon {
    switch (this) {
      case AddressType.home:
        return Ionicons.home;
      case AddressType.work:
        return Ionicons.business;
      case AddressType.partner:
        return Ionicons.heart;
      case AddressType.gym:
        return Ionicons.fitness;
      case AddressType.parent:
        return Ionicons.people;
      case AddressType.cafe:
        return Ionicons.cafe;
      case AddressType.park:
        return Ionicons.leaf;
      case AddressType.other:
        return Ionicons.ellipsis_horizontal_circle;
    }
  }
}

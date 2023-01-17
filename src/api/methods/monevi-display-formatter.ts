class MoneviDisplayFormatter {

  static toRupiah(number: number): string {
    var positiveNumber = number < 0 ? number * - 1 : number;
    var rupiah = `Rp ${positiveNumber.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    rupiah = number < 0 ? "- " + rupiah : rupiah;
    return rupiah;
  }

  static determineNumberByPositionType(number: number, entryPosition: string): number {
    if (entryPosition === "DEBIT") {
      number = number;
    }
    else if (entryPosition === "CREDIT") {
      number = -1 * number;
    }
    return number;
  }

  static convertUserAccountRoleForDisplay(roleName: string): string {
      if (roleName === "TREASURER") {
          return "Bendahara";
      }
      else if (roleName === "CHAIRMAN") {
          return "Ketua";
      }
      else if (roleName === "SUPERVISOR") {
          return "Pengawas";
      }
      return "";
  }

  static convertGeneralLedgerAccountTypeForDisplay(generalLedgerAccountType: string): string | null {
      if (generalLedgerAccountType === "CASH") {
          return "Kas";
      }
      else if (generalLedgerAccountType === "BANK") {
          return "Bank";
      }
      return null;
  }

  static convertTransactionTypeForDisplay(transactionType: string): string | null {
      if (transactionType === "NON_DAILY") {
          return "Non Rutin";
      }
      else if (transactionType === "DAILY") {
          return "Rutin";
      }
      return null;
  }

  static convertEntryPositionForDisplay(entryPosition: string): string | null {
    if (entryPosition === "DEBIT") {
        return "Debit";
    }
    else if (entryPosition === "CREDIT") {
        return "Kredit";
    }
    return null;
}

}


export {
  MoneviDisplayFormatter
};
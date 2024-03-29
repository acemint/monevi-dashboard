<template>
  <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" id="transactionAddModal">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Tambah Transaksi</h5>
          <button v-on:click="closeModal" type="button" class="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form>
            <div class="form-group">
              <label for="tanggal">Tanggal*</label>
              <input v-model="date" id="tanggal" type="date" class="form-control" name="tanggal" />
              <div class="invalid-feedback"></div>
            </div>
            <div class="row">
              <div class="form-group col-6">
                <label>Dompet*</label>
                <select v-model="generalLedgerAccountType" class="form-control selectric">
                  <option>Bank</option>
                  <option>Kas</option>
                </select>
              </div>

              <div class="form-group col-6">
                <label>Jenis Transaksi*</label>
                <select v-model="entryPosition" class="form-control selectric">
                  <option>Debit</option>
                  <option>Kredit</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label for="transaksi">Transaksi*</label>
              <input v-model="transactionName" id="transaksi" type="text" class="form-control" name="transaksi" />
              <div class="invalid-feedback"></div>
            </div>

            <div class="form-group">
              <label>Kategori*</label>
              <select v-model="transactionType" class="form-control selectric">
                <option>Rutin</option>
                <option>Non Rutin</option>
              </select>
            </div>

            <div class="form-group">
              <label for="keterangan">Keterangan*</label>
              <input v-model="description" id="keterangan" type="text" class="form-control" name="keterangan" />
              <div class="invalid-feedback"></div>
            </div>

            <div class="form-group">
              <label for="jumlah">Jumlah*</label>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text">Rp</span>
                </div>
                <input
                  v-model.number="amount"
                  type="number"
                  id="jumlah"
                  class="form-control"
                  name="jumlah"
                  aria-label="Jumlah (dalam rupiah)" />
              </div>
            </div>

            <div class="form-group" style="margin-bottom: 8px !important">
              <label class="col-form-label text-md-left">Bukti Transaksi*</label>
              <div class="mb-3">
                <input
                  v-on:change="loadImage"
                  ref="inputImage"
                  class="form-control"
                  type="file"
                  id="formFile"
                  accept="image/gif, image/jpeg, image/png" /><br />
                <img v-if="imageSrc != ''" v-bind:src="imageSrc" style="width: 100%" />
              </div>
            </div>
            <p class="text-danger" ref="errorMessageText" style="margin: 0px; padding: 0px"></p>
          </form>
        </div>
        <div class="modal-footer bg-whitesmoke br">
          <button v-on:click="closeModal" ref="closeModalButton" type="button" class="btn btn-secondary">Tutup</button>
          <button v-on:click="submitTransaction" type="button" class="btn btn-primary">Tambah Transaksi</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { MoneviPath } from '@/api/path/path';
  import type { MoneviBodyCreateTransaction } from '@/api/model/monevi-config';
  import { MoneviDateFormatter } from '@/api/methods/monevi-date-formatter';
  import { MoneviEnumConverter } from '@/api/methods/monevi-enum-converter';
  import { moneviAxios } from '@/api/configuration/monevi-axios';

  export default {
    data: function () {
      return {
        date: '',
        generalLedgerAccountType: 'Bank',
        entryPosition: 'Debit',
        transactionName: '',
        transactionType: 'Non Rutin',
        description: '',
        amount: '',
        imageSrc: '' as any,
      };
    },

    watch: {
      date(newDate, oldDate) {
        var tzOffset = new Date().getTimezoneOffset() * 60000;
        if (Date.now() - tzOffset < new Date(newDate).getTime()) {
          alert('Tidak bisa memasukkan tanggal yang melewati hari ini');
          this.date = '';
        }
      },
    },

    props: {
      organizationRegionId: String,
    },

    methods: {
      showModal() {
        this.clearData();
        var transactionAddModal: JQuery<HTMLDivElement> = $('#transactionAddModal');
        transactionAddModal.modal('show');
      },

      closeModal(event: Event) {
        var transactionDeleteModal: JQuery<HTMLDivElement> = $('#transactionAddModal');
        transactionDeleteModal.modal('hide');
      },

      loadImage(event: any) {
        var files: FileList = event.target.files;
        const reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.addEventListener('load', () => {
          this.imageSrc = reader.result;
        });
      },

      async submitTransaction() {
        var body = {} as MoneviBodyCreateTransaction;
        if (this.imageSrc == '') {
          alert('Bukti transaksi diperlukan');
          return;
        }
        if (parseFloat(this.amount) <= 0) {
          alert('Angka tidak boleh lebih kecil dibanding 1');
          return;
        }
        if (this.transactionName.length <= 3) {
          alert('Panjang nama transaksi harus melebihi 3 huruf');
          return;
        }
        body.organizationRegionId = this.organizationRegionId!;
        body.name = this.transactionName;
        body.transactionDate = MoneviDateFormatter.formatDate(this.date);
        body.amount = parseFloat(this.amount);
        body.generalLedgerAccountType = MoneviEnumConverter.convertGeneralLedgerAccountType(
          this.generalLedgerAccountType
        );
        body.entryPosition = MoneviEnumConverter.convertEntryPosition(this.entryPosition);
        body.type = MoneviEnumConverter.convertTransactionType(this.transactionType);
        body.description = this.description;
        body.proof = this.imageSrc;

        return await moneviAxios
          .post(MoneviPath.CREATE_NEW_TRANSACTION_PATH, new Array<MoneviBodyCreateTransaction>(body))
          .then((response) => {
            alert('Sukses menambahkan transaksi');
            var closeModalButton: any = this.$refs.closeModalButton;
            closeModalButton.click();
            this.$emit('successUpdate');
          })
          .catch((error) => {
            for (const key in error.response.data.errorFields) {
              var errorMessage = error.response.data.errorFields[key];
              var errorHtml: any = this.$refs.errorMessageText;
              errorHtml.innerHTML = '';
              errorHtml.innerHTML = errorMessage;
              break;
            }
          });
      },

      clearData() {
        this.date = '';
        this.generalLedgerAccountType = 'Bank';
        this.entryPosition = 'Debit';
        this.transactionName = '';
        this.transactionType = 'Non Rutin';
        this.description = '';
        this.amount = '';
        this.imageSrc = '';
        var inputImage: any = this.$refs.inputImage;
        inputImage.value = '';
      },
    },
  };
</script>

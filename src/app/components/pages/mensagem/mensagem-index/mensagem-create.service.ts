import { inject, Injectable } from '@angular/core';
import { MensagemIndexComponent } from './mensagem-index.component';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class MensagemCreateService {

    private _mensagemIndexComponent!: MensagemIndexComponent;

    constructor(private toastr: ToastrService) { }

    set mensagemIndexComponent(value: MensagemIndexComponent) {
        this._mensagemIndexComponent = value;
    }

    showModalCreate() {
        this._mensagemIndexComponent.mensagemCreateModal.showModal();
    }

    onCreateSuccess($event: any) {
        this.toastr.success('Mensagem cadastrada com sucesso');
        this._mensagemIndexComponent.getMensagens();
    }

    onCreateError($event: HttpErrorResponse) {
        this.toastr.error('Erro ao cadastrar mensagem');
    }

}
import { inject, Injectable } from '@angular/core';
import { MensagemIndexComponent } from './mensagem-index.component';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class MensagemEditService {

    private _mensagemIndexComponent!: MensagemIndexComponent;

    constructor(private toastr: ToastrService) { }

    set mensagemIndexComponent(value: MensagemIndexComponent) {
        this._mensagemIndexComponent = value;
    }

    showModalEdit(mensagemId: number = 0) {
        this._mensagemIndexComponent.mensagemId = mensagemId;
        this._mensagemIndexComponent.mensagemEditModal.showModal();
    }

    onEditSuccess($event: any) {
        this.toastr.success('Mensagem atualizada com sucesso');
        this._mensagemIndexComponent.getMensagens();
    }

    onEditError($event: any) {
        this.toastr.error('Erro ao atualizar mensagem');
    }

}
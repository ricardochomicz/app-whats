import { Routes } from '@angular/router';
import { EmpresaIndexComponent } from './components/pages/empresa/empresa-index/empresa-index.component';
import { EmpresaCreateComponent } from './components/pages/empresa/empresa-create/empresa-create.component';
import { MensagemIndexComponent } from './components/pages/mensagem/mensagem-index/mensagem-index.component';
import { EmpresaEditComponent } from './components/pages/empresa/empresa-edit/empresa-edit.component';
import { EmpresaMensagensComponent } from './components/pages/empresa/empresa-mensagens/empresa-mensagens.component';

export const routes: Routes = [
    {
        path: 'empresas', component: EmpresaIndexComponent
    },
    {
        path: 'empresas/novo', component: EmpresaCreateComponent
    },
    {
        path: 'empresas/:id/edit', component: EmpresaEditComponent
    },
    {
        path: 'empresas/:id/mensagens', component: EmpresaMensagensComponent
    },
    {
        path: 'mensagens', component: MensagemIndexComponent
    },
    {
        path: '',
        redirectTo: '/empresas',
        pathMatch: 'full'
    },
];

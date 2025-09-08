import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '', loadChildren: () => import('./features/compound/compound.routes')
            .then(m => m.COMPOUND_ROUTES)
    },
    { path: '**', redirectTo: '' },
];

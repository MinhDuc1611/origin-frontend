import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from './shared/shared.module';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/simulation/simulation.module').then(m => m.SimulationModule)
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    SharedModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

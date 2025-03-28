import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CandleStickChartComponent } from './components/tutorials-list/candleStickChart.component';

const routes: Routes = [
  { path: '', redirectTo: 'tutorials', pathMatch: 'full' },
  { path: 'tutorials', component: CandleStickChartComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

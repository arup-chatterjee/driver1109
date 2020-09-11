import { AuthGuard } from './guards/auth.guard';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'members',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
  
    //CanActivate: [AuthGuard] wrong
    canActivate: [AuthGuard]
  
  },
  {
    path: '',
    loadChildren: () => import('./public/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./public/signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'termsconditions',
    loadChildren: () => import('./public/termsconditions/termsconditions.module').then( m => m.TermsconditionsPageModule)
  },
  // {
  //   path: 'dashboard',
  //   loadChildren: () => import('./members/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  // }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

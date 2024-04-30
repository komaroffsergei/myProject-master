import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {BCPPageRoutingModule} from "./pages/bcp/bcp-routing.module";
import {AuthGuard} from "./guards";
import {LoginPage} from "./pages/login/login.page";
// import {MainPageScreenComponent} from "./main-page-screen/main-page-screen.component";

export const APP_ROUTES = {
  'login_page': 'login',
  'main_page': 'main',
  'profile_page': 'profile',
  'schedule_page': 'schedule',
  'bcp_page': 'bcp',
  'tabs_page': 'tabs'
}

const routes: Routes = [

  {
    path: '',
    pathMatch: 'full',
    canActivate: [AuthGuard],
    loadChildren: async () => (await import('./pages/main/main.module')).MainPageModule
  },
  {
    path: APP_ROUTES.login_page,
    pathMatch: 'full',
    loadChildren: async () => (await import('./pages/login/login.module')).LoginPageModule
  },
  {
    path: APP_ROUTES.main_page,
    pathMatch: 'full',
    canActivate: [AuthGuard],
    loadChildren: async () => (await import('./pages/main/main.module')).MainPageModule
  },
  // {
  //   path: APP_ROUTES.profile_page,
  //   pathMatch: 'full',
  //   canActivate: [AuthGuard],
  //   loadChildren: async () => (await import('./pages/profile/profile.module')).ProfilePageModule
  // },
  {
    path: APP_ROUTES.schedule_page,
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/schedule/schedule.module').then( m => m.SchedulePageModule)
  },
  {
    path: APP_ROUTES.bcp_page,
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/bcp/bcp.module').then( m => m.BCPPageModule)
  },

  // {
  //   path: APP_ROUTES.tabs_page,
  //   loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  // },
  // {
  //   path: 'main',
  //   loadChildren: () => import('./pages/main/main.module').then( m => m.MainPageModule)
  // },
  // {
  //   path: 'login',
  //   loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  // },
  // {
  //   path: 'profile',
  //   loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
  // }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

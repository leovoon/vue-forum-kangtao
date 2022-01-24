<template>
  <header id="header" class="header">
    <router-link to="/" class="logo">
      <img :src="logo" class="logo-img">
    </router-link>

    <div class="btn-hamburger">
      <!-- use .btn-humburger-active to open the menu -->
      <div class="top bar" />
      <div class="middle bar" />
      <div class="bottom bar" />
    </div>

    <!-- use .navbar-open to open nav -->
    <nav class="navbar">
      <ul>
        <li v-if="user" class="navbar-user">
          <router-link to="/me">
            <img class="avatar-small" :src="user?.avatar" :alt="user?.name">
            <span>
              {{ user?.name }}
              <img class="icon-profile" :src="arrowSvg" alt="">
            </span>
          </router-link>
          <!-- dropdown menu -->
          <!-- add class "active-drop" to show the dropdown -->
          <div
            id="user-dropdown" :class="{'active-drop': userDropDownOpen}"
          >
            <div class="triangle-drop" />
            <ul class="dropdown-menu">
              <li class="dropdown-menu-item">
                <a href="profile.html">View profile</a>
              </li>
              <li class="dropdown-menu-item">
                <a href="#">Log out</a>
              </li>
            </ul>
          </div>
        </li>
      </ul>

      <!--      <ul>-->
      <!--        <li class="navbar-item">-->
      <!--          <a href="index.html">Home</a>-->
      <!--        </li>-->
      <!--        <li class="navbar-item">-->
      <!--          <a href="category.html">Category</a>-->
      <!--        </li>-->
      <!--        <li class="navbar-item">-->
      <!--          <a href="forum.html">Forum</a>-->
      <!--        </li>-->
      <!--        <li class="navbar-item">-->
      <!--          <a href="thread.html">Thread</a>-->
      <!--        </li>-->
      <!--        &lt;!&ndash; Show these option only on mobile&ndash;&gt;-->
      <!--        <li class="navbar-item mobile-only">-->
      <!--          <a href="profile.html">My Profile</a>-->
      <!--        </li>-->
      <!--        <li class="navbar-item mobile-only">-->
      <!--          <a href="#">Logout</a>-->
      <!--        </li>-->
      <!--      </ul>-->
    </nav>
  </header>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import logo from '~/assets/kangtao-logo.png'
import arrowSvg from '~/assets/arrow-profile.svg'
import { useRootStore } from '~/stores/root'
const userDropDownOpen = ref(false)
// const mobileNavMenu = ref(false)

const rootStore = useRootStore()

const { userAuth: user } = storeToRefs(rootStore)

</script>

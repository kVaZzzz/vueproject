<template>
  <div>
    <ReviewForm/>
    <ReviewList/>
  </div>
</template>

<script>
import ReviewForm from './AppReviewsForm.vue';
import ReviewList from './AppReviewList.vue';

export default {
  components: {
    ReviewForm,
    ReviewList
  }
}
</script>

<template>
  <div id="app">
    <b-container>
      <h1>Products</h1>
      <hr/>
      <b-row>
        <b-col
            v-for="(product, index) in products"
            :key="product.id"
            cols="4"
          >
          <b-card
            :bg-variant="deleting == index ? 'dark' : ''" :text-variant="deleting == index ? 'white' : ''"
            :title="product.name"
            tag="article"
            style="max-width: 20rem;"
            class="mb-2"
          >
            <b-card-text>
              <template v-if="deleting == index">
                {{ error || 'Are you sure you want to delete this product?' }}
              </template>
              <template v-else>
                {{ product.description }}
              </template>
            </b-card-text>

            <template v-if="deleting == index">
              <b-button href="#" @click.prevent="cancelDelete" variant="dark" style="margin-right: 10px">Cancel</b-button>
              <b-button href="#" @click.prevent="deleteProduct" variant="danger">Delete</b-button>
            </template>
            <b-button v-else href="#" @click.prevent="confirmDelete(index)" variant="danger">Delete</b-button>
          </b-card>
        </b-col>
      </b-row>
      <b-row v-if="canLoadMore && !working">
        <b-col class="text-center">
          <b-button href="#" @click.prevent="load" variant="default">Load More</b-button>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      canLoadMore: false,
      currentPage: 0,
      deleting: null,
      error: '',
      products: [],
      working: false
    }
  },
  created() {
    this.load()
  },
  methods: {
    cancelDelete() {
      this.deleting = null
    },
    confirmDelete(index) {
      this.deleting = index
    },
    deleteProduct() {
      if (this.working) {
        return
      }
      const product = this.products[this.deleting]
      this.working = true
      this.$axios.delete(`/products/${product.id}`)
        .then(() => {
          this.products.splice(this.deleting, 1)
          this.deleting = null
          this.working = false
        })
        .catch(resp => {
          this.error = resp.message
          this.working = false
        })
    },
    load() {
      if (this.working) {
        return
      }
      this.working = true
      this.$axios.get(`/products?page=${++this.currentPage}`)
        .then(resp => {
          this.$set(this, 'products', [...this.products, ...resp.data.data.data])
          this.canLoadMore = resp.data.data.next_page_url !== null
          this.working = false
        })
        .catch(resp => {
          this.error = resp.message
          this.working = false
        })
    }
  }
};
</script>

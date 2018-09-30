<template>
     <div class="emojis">
          <!-- <ul class="emoji-controller">
               <li v-for="(pannel,index) in pannels" :key="index" @click="changeActive(index)" :class="{'active': index === activeIndex}">{{ pannel }}</li>
          </ul> -->
          <div class="emoji-container" style="height:100%">
               <a href="javascript:;" v-for="(item, index) in emojis" :key="index" @click="selectItem(item)">
                    <span class="emoji emoji-item" :class="`emoji${jEmojis.EMOJI_MAP[item][2]}`" :title="jEmojis.EMOJI_MAP[item][1]"></span>
               </a>
          </div>
     </div>
</template>
<script>

import jEmoji from './emoji.js'

export default {
     name: 'emoji',
     data() {
          return {
               emojiData: [],
               // pannels: ['表情', '自然', '物品', '地点', '符号'],
               activeIndex: 0,
               jEmojis: null
          }
     },
     methods: {
          selectItem(item) {

               let emojiU16 = this.jEmojis.EMOJI_MAP[item][0];
               this.$emit('select', emojiU16, item);

          }
     },
     computed: {
          emojis() {
               return Object.keys(this.jEmojis.EMOJI_MAP)
          }
     },
     created() {

          this.jEmojis = window.jEmoji;
          console.log(this.jEmojis);

     }
}
</script>

<style lang='scss' scoped>
@import "./emoji.css";
.emojis {
      width: 380px;
      height: 186px;
      bottom: 30px;
      background: #fff;
      z-index: 10;
      padding: 10px;
      margin-right: 10px;
      .emoji-controller {
            height: 36px;
            overflow: hidden;
            margin-bottom: 0;
            li {
                  float: left;
                  width: 76px;
                  font-size: 12px;
                  line-height: 36px;
                  cursor: pointer;
                  text-align: center;
                  position: relative;
                  &.active::after {
                        content: "";
                        width: 100%;
                        height: 1px;
                        background: #0689dd;
                        left: 0;
                        bottom: 4px;
                        position: absolute;
                  }
            }
      }
      .emoji-container {
            height: 140px;
            overflow-y: auto;
            overflow-x: hidden;
            position: relative;
            li {
                  font-size: 0;
                  padding: 5px;
                  a {
                        float: left;
                        overflow: hidden;
                        height: 35px;
                        transition: all ease-out 0.2s;
                        border-radius: 4px;
                        &:hover {
                              background-color: #d8d8d8;
                              border-color: #d8d8d8;
                        }
                        span {
                              width: 25px;
                              height: 25px;
                              display: inline-block;
                              border: 1px solid transparent;
                              cursor: pointer;
                        }
                  }
            }
      }
}
</style>

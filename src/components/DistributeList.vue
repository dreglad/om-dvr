<template>
  <v-layout>
    <v-list>
      <v-list-tile
        v-for="profile in distributionProfiles"
        :key="profile.id"
        @click="distribute({ profileId: profile.id, videoId })"
      >
        <v-list-tile-title>
          {{ profile.name }}
        </v-list-tile-title>
      </v-list-tile>
    </v-list>

    <v-dialog
      v-model="confirmDialog"
      :overlay="true"
      :persistent="!confirmed && !error"
      width="200"
      transition="fadein"
    >
      <v-card>
        <v-card-text v-if="confirmed" class="text-xs-center">
          Confirmado <v-icon class="pl-2"color="green">check</v-icon>
        </v-card-text>
        <v-card-text v-else-if="error" class="text-xs-center">
          Error <v-icon class="pl-2"color="deep-orange">error</v-icon>
        </v-card-text>
        <v-card-text v-else class="text-xs-center">
          <v-progress-circular indeterminate />
        </v-card-text>
      </v-card>
    </v-dialog>


    <v-dialog
      v-model="metadataDialog"
      :overlay="true"
      :width="540"
    >
      <v-card>
        <v-card-title class="title">Distribuir video</v-card-title>
        <v-container grid-list-sm class="pa-4">
          <v-layout row wrap>
            <v-flex xs5 class="pa-1">
              <v-select
                v-model="metadataTipo"
                :items="metadataTipoOptions[selectedStream.name === 'teleSUR HD' ? 'es' : 'en']"
                item-value="slug"
                item-text="nombre"
                label="Tipo de clip"
                autocomplete
                required
              />
            </v-flex>
            <v-flex xs7 class="pa-1">
              <v-select
                v-model="metadataPrograma"
                :items="metadataProgramaOptions[selectedStream.name === 'teleSUR HD' ? 'es' : 'en']"
                item-value="slug"
                item-text="nombre"
                dense
                label="Programa de origen"
                clearable
                autocomplete
              />
            </v-flex>
            <v-flex xs12 align-center justify-space-between>
              <v-layout align-center>
                <v-text-field
                  v-model="title"
                  placeholder="Título"
                  required
                />
              </v-layout>
            </v-flex>
            <v-flex xs12 align-center justify-space-between>
              <v-layout align-center>
                <v-text-field
                  v-model="description"
                  placeholder="Descripción"
                  multi-line
                />
              </v-layout>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <!-- <v-btn flat color="primary">Guardar para después</v-btn> -->
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="metadataDialog = false">Cancelar</v-btn>
          <v-btn flat @click="distributeMultimedia">Distribuir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-layout>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import backend from '@/api/backend'

export default {
  name: 'DistributeList',

  props: {
    initialTitle: String,
    initialDescription: String,
    videoId: Number
  },

  data () {
    return {
      selectedProfileId: null,
      metadataDialog: false,
      distributionProfiles: [
        { name: 'Multimedia teleSUR', id: 1 },
        { name: 'Correo electrónico', id: 4 },
        { name: 'YouTube', id: 3 }
        // { name: 'Multimedia teleSUR | Video Capturado en Español', id: 3 },
        // { name: 'Multimedia teleSUR | Video Capturado en Inglés', id: 4 }
      ],
      metadataTitle: '',
      metadataDescription: '',
      metadataPrograma: null,
      metadataTipo: null,
      metadataProgramaOptions: {
        'es': [],
        'en': []
      },
      metadataTipoOptions: {
        'es': [],
        'en': []
      },
      confirmDialog: false,
      confirmed: false,
      error: false
    }
  },

  mounted () {
    backend.getMetadataOptions('programa', 'es').then(({ data }) => {
      this.$set(this.metadataProgramaOptions, 'es', data)
    })
    backend.getMetadataOptions('programa', 'en').then(({ data }) => {
      this.$set(this.metadataProgramaOptions, 'en', data)
    })
    backend.getMetadataOptions('tipo_clip', 'es').then(({ data }) => {
      this.$set(this.metadataTipoOptions, 'es', data)
    })
    backend.getMetadataOptions('tipo_clip', 'en').then(({ data }) => {
      this.$set(this.metadataTipoOptions, 'en', data)
    })
  },

  computed: {
    ...mapState([
      'videos'
    ]),

    ...mapGetters([
      'selectedStream'
    ]),

    title: {
      get () {
        return this.metadataTitle || this.initialTitle
      },
      set (value) {
        this.metadataTitle = value
      }
    },

    description: {
      get () {
        return this.metadataDescription || this.initialDescription
      },
      set (value) {
        this.metadataDescription = value
      }
    },

    video () {
      return this.videos.find(video => video.id === this.videoId)
    }
  },

  methods: {
    distribute ({ profileId }) {
      this.confirmed = false
      this.error = false

      if (profileId === 1) {
        this.selectedProfileId = profileId
        this.metadataDialog = true
      }
      // if (profileId === 3 || profileId === 4) {
      //   this.confirmDialog = true
      //   backend.distributeCaptura({ profileId, videoId: this.videoId }).then(({ data }) => {
      //     this.confirmed = true
      //   }).catch((err) => {
      //     this.error = true
      //     console.log(err)
      //   })
      // } else if (profileId === 1 || profileId === 2) {
      //   this.selectedProfileId = profileId
      //   this.metadataDialog = true
      // }
    },

    distributeMultimedia () {
      backend.distributeMultimedia({
        stream: this.selectedStream,
        url: this.video.file,
        metadata: {
          titulo: this.metadataTitle,
          descripcion: this.metadataDescription,
          tipo: this.metadataTipo,
          programa: this.metadataPrograma,
          usuario_remoto: this.$store.getters.userEmail
        }
      }).then(({ data }) => {
        this.confirmed = true
      }).catch((err) => {
        console.log(err)
        this.error = true
      })
      this.metadataDialog = false
    }
  }
}
</script>
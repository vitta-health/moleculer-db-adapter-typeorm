/* tslint:disable no-var-requires*/
import {Post} from './Post';
const moleculer = require('moleculer');
const storeService = require('moleculer-db');
import {Action, Service} from 'moleculer-decorators';

import {TypeOrmDbAdapter} from '../../adapter';
import {Context} from 'moleculer';

@Service({
    adapter: new TypeOrmDbAdapter({
        database: 'memory',
        name: 'memory',
        type: 'sqlite',
    }),
    mixins: [storeService],
    model: Post,
    name: 'posts',
    settings: {
        fields: ['id', 'title', 'content', 'votes', 'status', 'author'],
        idField: 'id'
    },
})
export default class PostsService extends moleculer.Service {

    @Action({
        // params: {id: 'number'},
    })
    public async vote(ctx: Context) {
        return this.adapter.findById(ctx.params.id)
            .then((post: any) => {
                post.votes++;
                return this.adapter.repository.save(post);
            })
            .then(() => this.adapter.findById(ctx.params.id))
            .then((doc: any) => this.transformDocuments(ctx, ctx.params, doc));
    }

    @Action({
        // params: {id: 'number'},
    })
    public async unvote(ctx: Context) {
        return this.adapter.findById(ctx.params.id)
            .then((post: any) => {
                post.votes--;
                return this.adapter.repository.save(post);
            })
            .then(() => this.adapter.findById(ctx.params.id))
            .then((doc: any) => this.transformDocuments(ctx, ctx.params, doc));
    }

    public afterConnected() {
        this.logger.info('Connected successfully');
        return this.adapter.clear();
    }

}
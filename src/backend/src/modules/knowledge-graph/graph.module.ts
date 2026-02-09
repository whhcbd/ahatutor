import { Module } from '@nestjs/common';
import { GraphController } from './graph.controller';
import { Neo4jService } from './services/neo4j.service';
import { GraphBuilderService } from './services/graph-builder.service';
import { PathFinderService } from './services/path-finder.service';
import { GraphService } from './services/graph.service';

@Module({
  controllers: [GraphController],
  providers: [
    Neo4jService,
    GraphBuilderService,
    PathFinderService,
    GraphService,
  ],
  exports: [
    Neo4jService,
    GraphBuilderService,
    PathFinderService,
    GraphService,
  ],
})
export class GraphModule {}
